import { MongoClient } from "mongodb"

const connectionString = "mongodb+srv://hello-user:MNYwwP6igl4QpFqs@cluster0.a6sbbrl.mongodb.net/test?proxyHost=mongodb.bypass.host&proxyPort=80&proxyUsername=student&proxyPassword=student"

const client = new MongoClient(connectionString)
export const db = client.db("weather-api")



/*
\/\/\/\/\/\/\/\/\/\/\\/\/\/

Mongodb account 

user: hello-user
password: MNYwwP6igl4QpFqs

/\/\/\/\/\/\/\\/\/\/\/\/\/\
*/




