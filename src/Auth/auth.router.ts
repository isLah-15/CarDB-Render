// routing
import { Express } from "express";
import { createUserController, deleteUserController, getAllUsersController, loginUserController, updateUserController, verifyUserController } from "./auth.controller";

const user = (app: Express) => {
    // route
    app.route("/auth/register").post(
        async (req, res, next) => {
            try {
                await createUserController(req, res)
            } catch (error) {
                next(error)
            }

        }
    )

    // verify user route
    app.route("/auth/verify").post(
        async (req, res, next) => {
            try {
                await verifyUserController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )

    // login route
    app.route("/auth/login").post(
        async (req, res, next) => {
            try {
                await loginUserController(req, res)
            } catch (error) {
                next()
            }
        }

    )
    // get all users route
    app.route('/users').get(
        async (req, res, next) => {
            try {
                await getAllUsersController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
    // update user route
    app.route('/user/:id').put(
        async (req, res, next) => {
            try {
                await updateUserController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
    // delete user route
    app.route('/users/:id').delete(
        async (req, res, next) => {
            try {
                await deleteUserController(req, res)
            } catch (error) {
                next(error)
            }
        }
    )
}

export default user;