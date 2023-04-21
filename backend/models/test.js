export function Test(
    id,
    country,
    city
) {
    return { 
        id,
        country,
        city
    }
}

// import { create, getAll, getByID, update, deleteByID } from "./test-mdb.js"

// TEST

// deleteByID("6422f5f87c5dc90008452d6c").then(result => console.log(result))


// let test = await getByID("6422f5f87c5dc90008452d6c")
// test.city = "Vancouver"
// update(test)

// let allTests = await getAll()
// console.log(allTests)

// getByID("6442f5f87c5dc90008452d6b")
//     .then(test => console.log(test))
//     .catch(error => console.log(error))

// const test1 = Test(1, "Japan", "Sendai" )
// const test2 = Test(2, "brazil", "Rio" )

// console.log(test1)
// console.log(test2)

// let newCountryOne = Test(null, "Australia", "Canberra")
// let newCountryTwo = Test(null, "Canada", "Toronto")

// create(newCountryOne).then(result => console.log("country 1 inserted"))
// create(newCountryTwo).then(result => console.log("country 2 inserted"))


// TEST