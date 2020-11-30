module.exports = function waiterRoutes(waiters) {

    async function home(req, res, next) {
        try {
            res.render('home')

        } catch (err) {
            next(err)
        }
    }

    async function waiterGet(req, res, next) {
        try {
            const day = await waiters.days()
            const days = req.body.days

            res.render('waiters')

        } catch (err) {
            next(err);
        }
    }
    async function waiterPost(req, res, next) {
        try {
            const day = await waiters.days()
            const days = req.body.days

            if (days === undefined) {
                req.flash('error', 'Please input your name in the url and select workings days above!')
            } else if (days.length < 2) {
                req.flash('error', 'Please select 3 workings days!')

            }

            res.render('waiters', {
                day
            })
        } catch (err) {
            next(err)
        }
    }
    async function getDays(req, res, next) {
        try {
            const days = req.body.days
            const day = await waiters.days()
            const user = req.params.username


            await waiters.addName(user)

            await waiters.waiterShift(user)

            var uid = await waiters.getUserId(user)
            const personShift = await waiters.eachShifts(uid)

            day.forEach(element => {
                personShift.forEach(eachPers => {
                    if (eachPers.days_selected === element.id) {
                        element.state = "checked"
                    }
                })
            });

            res.render('waiters', {
                day,
                name: user
            })
        } catch (err) {
            next(err)
        }
    }
    async function postDays(req, res, next) {
        try {
            const user = req.params.username
            const days = req.body.days

            await waiters.addName(user)
            await waiters.addShift(user, days)
            req.flash('success', 'Successful!')

            const day = await waiters.waiterShift(user)
            var uid = await waiters.getUserId(user)
            await waiters.eachShifts(uid)

            res.render('waiters', {
                name: user,
                day,

            })
        } catch (err) {
            next(err)
        }
    }
    async function admin(req, res, next) {
        try {
            const day = await waiters.days()
            const shifts = await waiters.shiftsSelected()


            res.render('admin', {
                day,
                shifts
            })
        } catch (err) {
            next(err)
        }
    }
    async function reset(req, res, next) {
        try {
            const day = await waiters.days()
            const shifts = await waiters.shiftsSelected()

            await waiters.reset()
            res.render('admin', {
                day,
                shifts
            })
        } catch (err) {
            next(err)
        }
    }
    return {
        home,
        waiterGet,
        waiterPost,
        getDays,
        postDays,
        admin,
        reset
    }
}