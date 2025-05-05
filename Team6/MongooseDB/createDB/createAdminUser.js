db = db.getSiblingDB('admin');

if (db.getUser("dbAdmin") === null) {
  db.createUser({
    user: "dbAdmin",
    pwd: "test",
    roles: ["readWriteAnyDatabase", "dbAdminAnyDatabase", "clusterAdmin"]
  });
  print("Admin user created.");
} else {
  print("Admin user already exists.");
}
