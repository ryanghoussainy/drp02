import { db } from '../lib/supabase.js';

const PLAYER_NAME = 'You';

async function testJoin() {
  const { error } = await db
    .from("game")
    .upsert([{
        name: PLAYER_NAME,
        host: false,
        age: 23,
        gender: true, // male
        skill_level: 2,
        id: "ce40f00b-3c74-41b0-8759-10de4f4c8ab9",
    }]);

  if (error) {
    throw new Error(`Failed to join game: ${error.message}`);
  }
  console.log('✅ Successfully joined the game');
}

async function testInGame() {
  const { data, error } = await db
    .from('game')
    .select('*')
    .eq('name', PLAYER_NAME)

  if (error) {
    throw new Error(`Failed to check in-game status: ${error.message}`);
  }

  if (data.length === 0) {
    throw new Error('User is not in the game');
  }
  console.log('✅ User is in the game');
}

async function testLeave() {
  const { error } = await db
    .from("game")
    .delete()
    .eq("name", PLAYER_NAME);

  if (error) {
    throw new Error(`Failed to leave game: ${error.message}`);
  }
  console.log('✅ Successfully left the game');
}

async function testNotInGame() {
  const { data, error } = await db
    .from('game')
    .select('*')
    .eq('name', PLAYER_NAME)

  if (error) {
    throw new Error(`Failed to check not in-game status: ${error.message}`);
  }

  if (data.length > 0) {
    throw new Error('User is still in the game');
  }
  console.log('✅ User is not in the game');
}

(async () => {
  try {
    await testJoin();
    await testInGame();
    await testLeave();
    await testNotInGame();
    console.log('🎉 All tests passed');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test suite failed', err);
    process.exit(1);
  }
})();
