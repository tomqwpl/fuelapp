import { type ClientSchema, a, defineData, defineFunction } from '@aws-amplify/backend';

const fooHandler = defineFunction({
  entry: './handler.ts'
})

const schema = a.schema({  
  Location: a.model({
        name:a.string().required(),
        events:a.hasMany('Event', 'locationId'),
      })
      .identifier(['name'])
      .authorization((allow) => [
        allow.group("admin"),
        allow.authenticated().to(["read"])
      ]),

  Event: a.model({
        startDate: a.date().required(),
        endDate: a.date().required(),
        locationId: a.id().required(),
        location: a.belongsTo('Location', 'locationId'),
        cars: a.hasMany("EventCar", "eventId"),
        fuel: a.hasMany("Fuel", "eventId"),
        eventType: a.enum(["Trackday", "Raceday", "Testing"]),
      })
      .authorization((allow) => [
        allow.group("admin"),
        allow.authenticated().to(["read"])
      ]),

  Car: a.model({
        name: a.string().required(),
        events: a.hasMany("EventCar", "carId"),
        fuel: a.hasMany("Fuel", "carId")
      })
      .identifier(['name'])
      .authorization((allow) => [
        allow.group("admin"),
        allow.authenticated().to(["read"])
      ]),

  EventCar: a.model({
      eventId: a.id().required(),
      carId: a.id().required(),
      event: a.belongsTo("Event", "eventId"),
      car: a.belongsTo("Car", "carId"),
    })
      .authorization((allow) => [
        allow.group("admin"),
        allow.authenticated().to(["read"])
      ]),


  Fuel: a.model({
      eventId: a.id().required(),
      carId: a.id().required(),
      event: a.belongsTo("Event", "eventId"),
      car: a.belongsTo("Car", "carId"),
      when: a.datetime().required(),
      quantity: a.integer().required(),
      addedBy: a.string().required(),
    })
    .authorization((allow) => [
        allow.group("admin"),
        allow.group("mechanic"),
    ]),

  Foo: a
    .mutation()
    .arguments({name: a.string().required()})
    .returns(a.string())
    .handler(a.handler.function(fooHandler))
});
export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});