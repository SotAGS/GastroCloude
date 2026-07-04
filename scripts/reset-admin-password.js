const bcrypt = require('bcrypt');
const { Client } = require('pg');

async function main() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);

  const client = new Client({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'postgres',
    database: 'gastrocloud',
  });

  await client.connect();

  const updateResult = await client.query(
    `UPDATE "user"
     SET password_hash = $1,
         is_active = true,
         updated_at = NOW()
     WHERE username = $2 OR email = $3
     RETURNING id, username, email, is_active`,
    [hash, 'admin', 'admin@gastrocloud.local'],
  );

  if (updateResult.rowCount === 0) {
    console.log('No se encontro usuario admin para actualizar.');
  } else {
    console.log('Usuario admin actualizado:');
    console.table(updateResult.rows);
    console.log('Nueva contrasena: admin123');
  }

  await client.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
