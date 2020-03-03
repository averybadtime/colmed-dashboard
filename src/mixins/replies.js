export default {
  data() {
    return {
      replies: []
    }
  },
  methods: {
    async getRepliesByUserId( userId ) {
      let replies
      try {
        
          const query = this.$parse.createQuery( "Reply" )

          const UserObject = this.$parse.createObject( "_User" )
          
          UserObject.createWithoutData(userId)

          query.equalTo("user", UserObject)

          replies = await query.find()
        

      } catch ( ex ) {
        console.log(ex)
        return console.error("Ocurrió un error al obtener las preguntas. Intente nuevamente.")
      }

      
        replies.forEach(reply => {
          const _reply = reply.toJSON()
          console.log(reply)
        })
      

    },
    getResolved() {
      return this.replies.length
    },
    getWins() {
      const wins = this.replies.filter( x => x.valid )
      return wins.length
    },
    getLosses() {
      const losses = this.replies.filter( x => !x.valid )
      return losses.length
    } 
  }
}