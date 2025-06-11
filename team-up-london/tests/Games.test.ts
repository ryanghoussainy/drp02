import { supabase } from '../lib/supabase';
import { joinGame, leaveGame } from '../operations/Games';

const PLAYER_ID = "95251326-b1d7-46c0-856d-39379a68ebd2";
const GAME_ID = "94242c75-5bd8-4b55-81b0-693f01ce8d60";

async function testInGame() {
  await joinGame(PLAYER_ID, GAME_ID);

  const { data, error } = await supabase
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

  const { data, error } = await supabase
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
