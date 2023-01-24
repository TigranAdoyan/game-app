class UserDataAccess {
   constructor(connection) {
      this.connection = connection;
   }

   findOne(props = {}) {
      const where = props.where || {};
      return this.connection
          .select('id', 'username', 'age', 'email', 'is_email_confirmed', 'password', 'profile_img_url')
          .from('users')
          .where(where).then(response => response[0]);
   }
}

module.exports = UserDataAccess;
