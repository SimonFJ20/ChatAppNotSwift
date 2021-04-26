import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

try {
    
    const portHTTP = <string>process.env.HTTP_PORT;
    
} catch(error) {
    
}
