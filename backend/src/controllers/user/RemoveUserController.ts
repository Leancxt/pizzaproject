import { Request, Response } from 'express'
import { RemoveUserService } from '../../services/user/RemoveUserService'

class RemoveUserController{
    async handle(req: Request, res: Response){

        const user_id = req.query.user_id as string;

        const removeUser = new RemoveUserService();

        const user = await removeUser.execute({
            user_id
        });

        return res.json({user_id});
 
    }

}

export { RemoveUserController }