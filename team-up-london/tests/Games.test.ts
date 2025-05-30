import { db } from '../lib/supabase';
import { joinGame, leaveGame } from '../operations/Games';

const PLAYER_NAME = 'You';

async function testInGame() {
  await joinGame(PLAYER_NAME);

  const { data, error } = await db
    .from('game')
    .select('*')
    .eq('name', PLAYER_NAME)

  if (error) {
    throw new Error(`Failed to check in-game status: ${error.message}`);
  }

  expect(data.length).not.toBe(0);
  
  console.log('User is in the game');
}

async function testNotInGame() {
  await leaveGame(PLAYER_NAME);

  const { data, error } = await db
    .from('game')
    .select('*')
    .eq('name', PLAYER_NAME)

  if (error) {
    throw new Error(`Failed to check not in-game status: ${error.message}`);
  }

  expect(data.length).toBeLessThanOrEqual(0);

  console.log('User is not in the game');
}

describe('Game participation', () => {
  it('should add user to game', async () => {
    await testInGame();
  });

  it('should remove user from game', async () => {
    await testNotInGame();
  });
});
