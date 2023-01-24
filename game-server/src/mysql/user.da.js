class User {
   constructor(knex) {
      this.knex = knex;
   }

   list(props = {}) {
      const where = props.where || {};
      const whereNot = props.whereNot || {};
      return this.knex
          .select('id', 'username', 'age', 'email', 'profile_img_url')
          .from('users')
          .where(where)
          .whereNot(whereNot);
   }
}

module.exports = User;
