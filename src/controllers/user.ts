import User from '../models/User';

// TODO: Implement signup controller
const signup = async (req: Request, res: any) => {
  try {
    // const user = new User(req.body);
    // await user.save();
    let user;
    console.log('body', req.body);

    // const token = await user.generateAuthToken();
    res.status(201).json({ message: 'User created ' });
  } catch (error) {
    res.status(400).send(error);
  }
};

export default signup;
