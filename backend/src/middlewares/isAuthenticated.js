// import {Response,Request,NextFunction, response} from 'express';
import  JWT  from 'jsonwebtoken';
import authConfig from '../controller/auth/auth.js';

export default function isAuthenticated(req,res,next){
 const authHeader=req.headers.authorization;

 if(!authHeader){
    return res.status(400).json({mensagem:" falta JWT token "})
 }
//  const token =authHeader.split(' ')[1]
//  const token =authHeader.split(' ')[1]
//  console.log(token)
 try {
    const decodedToken=JWT.verify(authHeader,authConfig.jwt.secret)
    console.log(decodedToken)
   return  next();
 } catch (error) {
    res.status(401).json({mensagem:"invalido JWT"})
 }
}