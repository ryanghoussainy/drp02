import { db } from '../lib/supabase';
import { joinGame, leaveGame } from '../operations/Games';

const PLAYER_ID = "a27ce332-d44c-4f19-96a0-d39f2ef8b821";
const GAME_ID = "94242c75-5bd8-4b55-81b0-693f01ce8d60";

async function testInGame() {
  await joinGame(PLAYER_ID, GAME_ID);

  const { data, error } = await db
    .from('game_players')
    .select('*')
    .eq('game_id', GAME_ID)
    .eq('player_id', PLAYER_ID);

  if (error) {
    throw new Error(`Failed to check in-game status: ${error.message}`);
  }

  expect(data.length).not.toBe(0);
  
  console.log('User is in the game');
}

async function testNotInGame() {
  await leaveGame(PLAYER_ID, GAME_ID);

  const { data, error } = await db
    .from('game_players')
    .select('*')
    .eq('game_id', GAME_ID)
    .eq('player_id', PLAYER_ID);

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
