import {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
} from 'graphql';

import express from 'express'
import graphqlHTTP from 'express-graphql'

const PersonList = [{
"_id": 1001,
"name": 'Test',
"age": 20
},
{
  "_id": 1002,
  "name": 'Lily',
  "age": 21
},
{
  "_id": 1003,
  "name": 'Dyna',
  "age": 20
  }
]

var PersonSchema = new GraphQLObjectType({
  name: 'Person',
  fields: {
    _id: { type: GraphQLInt },
    name: { type: GraphQLString },
    age: { type: GraphQLInt }
  }
});

var PersonQuery = new GraphQLObjectType({
  name: 'PersonQuery',
  fields: {
    people: { 
      type: new GraphQLList(PersonSchema),
      args: {
        _id: { type: GraphQLInt },
        name: { type: GraphQLString },
        age: { type: GraphQLInt }
      },
      resolve: (_, {_id, name, age}) => {
        let query;
        if (_id){
          console.log(Array.from(PersonList).filter(person => person._id ==_id))
          return Array.from(PersonList).filter(person => person._id ==_id)
        }
        else if (name) {
          console.log(Array.from(PersonList).filter(person => person.name == name))
          return Array.from(PersonList).filter(person => person.name == name)
        }
        else if(age)
        {
          console.log(Array.from(PersonList).filter(person => person.age == age))
          return Array.from(PersonList).filter(person => person.age == age);
        }
        else 
        {
          console.log(PersonList)
          return PersonList
        }
      }
    }
  }
})

var MutationObject = new GraphQLObjectType({
  name: 'PersonMutation',
  fields: {
    create: {
      type: PersonSchema,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLInt }
      },
      resolve: (_, { _name, _age }) => {
        let person = { _id: `100${parseInt(PersonList.length) + 1}`, name: _name, age: _age }
        return PersonList.push(person)
      }
    },
    delete: {
      type: PersonSchema,
      args: {
        _id: { 
          type: new GraphQLNonNull(GraphQLInt) 
        }
      },
      resolve: (_, {id}) => {
        return PersonList.filter(person => person._id !== id);
      }
    }
  },
})

var schema = new GraphQLSchema({
  query: PersonQuery,
  mutation: MutationObject
});

const app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  graphiql: true
}));

app.listen(3000);
