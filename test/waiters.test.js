let assert = require('assert')
let Waiters = require('../waiters')


const pg = require("pg");
const Pool = pg.Pool;
const connectionString = process.env.DATABASE_URL || 'postgresql://kagiso:123@localhost:5432/waiters_test';
const pool = new Pool({
    connectionString
});


const waiters = Waiters(pool)




describe("The Waiters function", async function () {


    beforeEach(async function () {
        await pool.query(`delete from shifts`)

    })


    it("should be able to add waiters names to the database", async function () {


        var name = 'Kagiso'

        await waiters.addName(name)


        assert.deepEqual([{ name: 'Kagiso' },{ name: 'Jill' }], await waiters.allWaiters());
    });


    it("should be able to add  multiple waiters names to the database", async function () {


        var name = 'Kagiso'
        var name2 = 'Jill'


        await waiters.addName(name)
        await waiters.addName(name2)

        assert.deepEqual([{ name: 'Kagiso' }], await waiters.allWaiters());
    });


    it("should be able to add a waiter and their shifts to the database", async function () {


        var name = 'Kagiso'
        var days = [1, 2, 3]


        await waiters.addShift(name, days)


        assert.deepEqual({ "name": "Kagiso", "color": "red", "day": "Monday", "id": 1, "waiters": ["Kagiso"] }, { "name": "Kagiso", "color": "red", "day": "Monday", "id": 1, "waiters": ["Kagiso"] }, { "name": "Kagiso", "color": "red", "day": "Tuesday", "id": 1, "waiters": ["Kagiso"] }, { "name": "Kagiso", "color": "red", "day": "Wednesday", "id": 1, "waiters": ["Kagiso"] }, { "name": "Kagiso", "color": "red", "day": "Thursday", "id": 1, "waiters": [] }, { "name": "Kagiso", "color": "red", "day": "Friday", "id": 1, "waiters": [] }, { "name": "Kagiso", "color": "red", "day": "Saturday", "id": 1, "waiters": [] }, { "name": "Kagiso", "color": "red", "day": "Sunday", "id": 1, "waiters": [] }, await waiters.shiftsSelected());
    });


    it("should be able to get all the working days in database", async function () {



        await waiters.days()


        assert.deepEqual([{ day: "Monday", id: 1 }, { day: "Tuesday", id: 2 }, { day: "Wednesday", id: 3 }, { day: "Thursday", id: 4 }, { day: "Friday", id: 5 }, { day: "Saturday", id: 6 }, { day: "Sunday", id: 7 }], await waiters.days());
    });


    it("should return all the waiters in database", async function () {



        await waiters.allWaiters()


        assert.deepEqual([{ name: 'Kagiso' }, { name: 'Jill' }], await waiters.allWaiters());
    });

    it("Should get the the waiters Id ", async function () {

        var user = "Kagiso"
        await waiters.addName(user)
        await waiters.getUserId(user)

        assert.deepEqual(1, await waiters.getUserId(user))

    })

    it("should reset the waiters shifts in database", async function () {



        await waiters.reset()


        assert.deepEqual([], await waiters.reset());
    });

    after(async function () {
        pool.end();
    })
});


