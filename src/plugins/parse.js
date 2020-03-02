import Parse from "parse"

Parse.initialize(
  "MjCWP1Wh5RHp1Sow1Tl7p80bwQgZIQ0x0WptAMLq",
  "rZtMLB0qp0urCsFia0iNjS8vYAFmqe1WimLbh3iH",
  "c7jbvnB1EtkIWgbjfhcEFqD0ddJszYOLc93jv1TA"
)

Parse.serverURL = "http://137.117.46.98:1337/parse"
Parse.masterKey = "c7jbvnB1EtkIWgbjfhcEFqD0ddJszYOLc93jv1TA"

export default {
  install: Vue => {
    const extension = {
      count: async parseEntity => {
        const Entity = extension.createObject(parseEntity)
        const query  = new Parse.Query(Entity)
        try {
          return await query.count()
        } catch (ex) {
          throw ex
        }
      },
      createObject: parseEntity => Parse.Object.extend(parseEntity),
      createQuery: parseEntity => {
        const Entity = extension.createObject(parseEntity)
        const query  = new Parse.Query(Entity)
        return query
      }
    }
    Object.assign(Parse, extension)
    Vue.prototype.$parse = Parse
  }
}