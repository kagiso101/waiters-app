module.exports = function (pool) {

    //adds name to waiters table 
    async function addName(name) {
        if (name !== "") {

            const nameCheck = await pool.query(`select * from waiters where name = $1`, [name])
            const { rowCount } = nameCheck

            if (rowCount === 0) {
                const adding = await pool.query(`insert into waiters(name) values($1)`, [name])
            } return
        }
    }

    //adds waiters name(id) and days_Selected(id)
    async function addShift(name, days) {

        await addName(name)

        if (days !== undefined) {

            //getting name id
            const nameCheck = await pool.query(`select id from waiters where name = $1`, [name])
            var waiterId = nameCheck.rows[0].id
            //looping through days selected

            await pool.query(`delete from shifts days_selected where waiter_id = $1`, [waiterId])
            for (var i = 0; i < days.length; i++) {
                var selectedDays = days[i]

                await pool.query(`insert into shifts(days_selected, waiter_id) values ($1, $2)`, [selectedDays, waiterId]);

            }
        } else {
            return false
        }
    }

    async function getUserShifts(userId) {
        const userShift = await pool.query(`select name, day from shifts 
        join waiters on shifts.waiter_id = waiters.id 
        join days on shifts.days_selected = days.id where waiter_id = $1`, [userId])
        return userShift.rows
    }


    async function getUserId(name) {

        const nameCheck = await pool.query(`select id from waiters where name = $1`, [name])
        return nameCheck.rows[0].id
    }

    //keeps the buttons checked 
    async function waiterShift(name) {
        const userId = await getUserId(name)
        const weekDay = await days();
        const userShift = await getUserShifts(userId);

        weekDay.forEach(day => {
            day.state = '';
            userShift.forEach(function (waiter) {
                if (waiter.day == day.day) {
                    day.state = 'checked'
                }
            })
        });

        return weekDay



    }
    //selects days
    async function days() {

        const dayCheck = await pool.query(`select * from days`)
        return dayCheck.rows

    }
    //gets waiter and the days they selected
    async function shiftsSelected() {

        const chosen = await pool.query(`select * from days`)
        const allDays = chosen.rows
        //getting each day of the week 

        // looping through each day of the week
        for (var i = 0; i < allDays.length; i++) {

            //gives all days of week
            var workingDay = allDays[i];

            //gets all waiters who selected specific day
            const dayCheck = await pool.query(`select name from shifts join
             waiters on shifts.waiter_id = waiters.id 
            join days on shifts.days_selected = days.id 
                where days_selected = $1`, [workingDay.id])
            const waitersForDay = dayCheck.rows;

            workingDay.waiters = waitersForDay.map((w) => w.name);

            if (workingDay.waiters.length < 3) {
                workingDay.color = "blue";
            } else if (workingDay.waiters.length > 3) {
                workingDay.color = "red";
            } else {
                workingDay.color = "green";
            }
        }
        return allDays;

    }
    //returns all waiters
    async function allWaiters() {
        const waiters = await pool.query(`select name from waiters`);
        return waiters.rows;
    }

    async function eachShifts(id) {

        const eachOf = await pool.query(`select * from days 
        join shifts on days.id = shifts.days_selected
         where waiter_id = $1`, [id])

        return eachOf.rows
    }
    async function reset() {
        const reset = await pool.query(`delete from shifts`)
        return reset.rows
    }
    return {
        allWaiters,
        addShift,
        addName,
        days,
        shiftsSelected,
        waiterShift,
        reset,
        getUserId,
        eachShifts
    }
}