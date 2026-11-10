'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  MIN_PLAYERS,
  MAX_PLAYERS,
  GameManager,
  computeBottleSpin,
  normalizeDeg
} = require('../src/gameEngine');

function angularDist(a, b) {
  const diff = Math.abs(normalizeDeg(a) - normalizeDeg(b));
  return diff > 180 ? 360 - diff : diff;
}

test('visitor and secret-key authentication start with 100 points, 1 DM ticket, and no gender', () => {
  const gm = new GameManager();
  const vis = gm.authenticate('c1', { mode: 'visitor', avatarId: 'fox' });
  assert.equal(vis.ok, true);
  assert.equal(vis.account.score, 100);
  assert.equal(vis.account.dmTickets, 1);
  assert.equal('gender' in vis.account, false);

  const sec1 = gm.authenticate('c2', { mode: 'secret', alias: 'Kuzey Tilkisi', secretKey: 'gizli-kelime' });
  assert.equal(sec1.ok, true);
  assert.equal(sec1.account.alias, 'Kuzey Tilkisi');

  // Re-authenticating with same secret key restores same accountKey
  const sec2 = gm.authenticate('c3', { mode: 'secret', secretKey: 'gizli-kelime' });
  assert.equal(sec2.account.accountKey, sec1.account.accountKey);
});

test('room enforces min 2 and max 6 players including bot guests', () => {
  const gm = new GameManager({ spinDurationMs: 0, answerTimeoutMs: 5000 });
  const c = gm.createRoom('p1', { maxPlayers: 6, chatMode: 'both' });
  assert.equal(c.room.minPlayers, MIN_PLAYERS);
  assert.equal(c.room.maxPlayers, MAX_PLAYERS);
  assert.equal(c.room.phase, 'waiting');
  assert.equal(gm.spinBottle('p1').ok, false);

  // Add 1 bot -> 2 players -> ready_to_spin
  const b1 = gm.addBot('p1');
  assert.equal(b1.ok, true);
  assert.equal(b1.room.phase, 'ready_to_spin');

  // Fill to 6
  for (let i = 3; i <= 6; i += 1) {
    assert.equal(gm.addBot('p1').ok, true);
  }
  assert.equal(gm.addBot('p1').ok, false);
  assert.equal(gm.joinRoom('p2', c.room.code).ok, false);
});

test('computeBottleSpin aligns tip to target and tail to asker for 2..6 players', () => {
  for (let count = 2; count <= 6; count += 1) {
    const players = Array.from({ length: count }, (_, i) => ({ id: `u${i}` }));
    for (let trial = 0; trial < 12; trial += 1) {
      const spin = computeBottleSpin(players, trial * 95, null);
      assert.notEqual(spin.targetIndex, spin.askerIndex);
      const tipAngle = normalizeDeg(spin.endAngle);
      const tailAngle = normalizeDeg(spin.endAngle + 180);
      const targetAngle = (360 * spin.targetIndex) / count;
      const askerAngle = (360 * spin.askerIndex) / count;
      assert.ok(angularDist(tipAngle, targetAngle) <= 10.5);
      const askerDist = angularDist(tailAngle, askerAngle);
      for (let other = 0; other < count; other += 1) {
        if (other === spin.askerIndex) continue;
        assert.ok(askerDist < angularDist(tailAngle, (360 * other) / count));
      }
    }
  }
});

test('completing turns awards +25 points and +1 DM ticket every 100-point milestone', () => {
  const gm = new GameManager({ spinDurationMs: 0, answerTimeoutMs: 5000, botDelayMs: 0 });
  gm.authenticate('p1', { mode: 'visitor', alias: 'Kahraman' });
  const r = gm.createRoom('p1', { maxPlayers: 2, chatMode: 'both' });
  const b = gm.addBot('p1');
  const botId = b.bot.id;

  // Complete 4 rounds where p1 gains >= 100 pts (from 100 -> 200) -> gains +1 DM ticket!
  for (let round = 0; round < 10; round += 1) {
    const accBefore = gm.getAccountByPlayer('p1');
    if (accBefore.score >= 200) break;

    gm.spinBottle('p1');
    if (gm.getRoomByPlayer('p1').phase === 'choosing_mode') {
      gm.chooseMode('p1', 'truth');
    }
    if (gm.getRoomByPlayer('p1').phase === 'asking_question') {
      gm.submitQuestion('p1', { text: 'En sevdiğin gizli hobi nedir?', source: 'custom' });
    }
    gm.completeTurn('p1', true);
  }

  const accAfter = gm.getAccountByPlayer('p1');
  assert.ok(accAfter.score >= 200);
  assert.ok(accAfter.dmTickets >= 2);
  const ticketsBeforeUnlock = accAfter.dmTickets;

  // Unlock permanent DM contact consumes 1 ticket
  const unlock = gm.unlockDmContact('p1', botId);
  assert.equal(unlock.ok, true);
  assert.equal(unlock.account.dmTickets, ticketsBeforeUnlock - 1);
});

test('30s answer timer expires turn automatically and resets phase', async () => {
  const gm = new GameManager({ spinDurationMs: 0, answerTimeoutMs: 40, botDelayMs: 0 });
  gm.authenticate('p1', { mode: 'visitor' });
  gm.authenticate('p2', { mode: 'visitor' });
  const r = gm.createRoom('p1', { chatMode: 'both' });
  gm.joinRoom('p2', r.room.code);

  let expiredFired = false;
  const spin = gm.spinBottle('p1');
  const { targetId, askerId } = spin.room.currentTurn;
  gm.chooseMode(targetId, 'dare');
  gm.submitQuestion(askerId, { text: '10 saniye gül!', source: 'custom' }, {
    onExpire: () => { expiredFired = true; }
  });

  await new Promise((resolve) => setTimeout(resolve, 80));
  assert.equal(expiredFired, true);
  assert.equal(gm.getRoomByPlayer('p1').phase, 'ready_to_spin');
});

test('chat modes and @mention detection work properly', () => {
  const gm = new GameManager({ spinDurationMs: 0 });
  gm.authenticate('a1', { mode: 'visitor', alias: 'Tilki1' });
  gm.authenticate('a2', { mode: 'visitor', alias: 'Baykus2' });
  const room = gm.createRoom('a1', { chatMode: 'both' });
  gm.joinRoom('a2', room.room.code);

  const chat = gm.sendChatMessage('a1', '@Baykus2 selam!');
  assert.equal(chat.ok, true);
  assert.deepEqual(chat.mentionedIds, ['a2']);

  // Text-only blocks voice
  gm.updateRoomSettings('a1', { chatMode: 'text' });
  assert.equal(gm.setVoiceState('a1', { micEnabled: true }).ok, false);

  // Voice-only blocks text chat
  gm.updateRoomSettings('a1', { chatMode: 'voice' });
  assert.equal(gm.sendChatMessage('a1', 'Yazı').ok, false);
  assert.equal(gm.setVoiceState('a1', { micEnabled: true }).ok, true);
});

test('Lokal Dükkan packs, VIP, 4 question decks, ad rewards (+50P), and FOMO noTickets flag', () => {
  const gm = new GameManager({ spinDurationMs: 0, adCooldownMs: 0, botDelayMs: 0 });
  gm.authenticate('u1', { mode: 'visitor' });
  gm.authenticate('u2', { mode: 'visitor' });

  const room = gm.createRoom('u1', { chatMode: 'both' });
  gm.joinRoom('u2', room.room.code);

  // Locked deck cannot be selected before purchase
  const lockedSelect = gm.selectDeck('u1', 'midnight');
  assert.equal(lockedSelect.ok, false);
  assert.equal(lockedSelect.locked, true);

  // Purchase flirt deck & switch room deck
  const deckBuy = gm.purchaseDeck('u1', 'flirt');
  assert.equal(deckBuy.ok, true);
  assert.equal(deckBuy.room.deckId, 'flirt');

  // Card drawn inside round uses flirt deck
  const spin = gm.spinBottle('u1');
  const { targetId, askerId } = spin.room.currentTurn;
  gm.chooseMode(targetId, 'truth');
  const card = gm.drawDeckCard(askerId, 'Tümü');
  assert.equal(card.ok, true);
  assert.equal(card.card.deckId, 'flirt');

  // Exhaust 1 starting DM ticket -> next unlock returns noTickets: true (FOMO)
  const firstUnlock = gm.unlockDmContact('u1', 'target_1');
  assert.equal(firstUnlock.ok, true);
  assert.equal(firstUnlock.account.dmTickets, 0);

  const fomoAttempt = gm.unlockDmContact('u1', 'target_2');
  assert.equal(fomoAttempt.ok, false);
  assert.equal(fomoAttempt.noTickets, true);

  // Watch 2 ads -> +50P +50P = 200P -> +1 free DM ticket!
  const ad1 = gm.claimAdReward('u1');
  assert.equal(ad1.ok, true);
  assert.equal(ad1.account.score, 150);
  assert.equal(ad1.ticketsEarned, 0);

  const ad2 = gm.claimAdReward('u1');
  assert.equal(ad2.ok, true);
  assert.equal(ad2.account.score, 200);
  assert.equal(ad2.ticketsEarned, 1);
  assert.equal(ad2.account.dmTickets, 1);

  // Purchase DM packs & VIP pack
  const p3 = gm.purchaseDmPack('u1', 'dm_3');
  assert.equal(p3.account.dmTickets, 4);

  const vip = gm.purchaseDmPack('u1', 'vip_plus');
  assert.equal(vip.account.isVip, true);
  assert.equal(vip.account.dmTickets, 29);
  assert.ok(vip.account.unlockedDecks.includes('midnight'));
  assert.ok(vip.account.unlockedDecks.includes('psychology'));
});
