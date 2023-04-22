import { Response } from 'express';
import YAML from 'yaml';

export default (response: Response, status: number, data: any): void => {
    response.format({
        json: () => response.status(status).json(data),
        'application/x-yaml': () => {
            response.setHeader('Content-Type', 'application/x-yaml');
            response.status(status).send(YAML.stringify(data));
        },
        'application/yaml': () => {
            response.setHeader('Content-Type', 'application/yaml');
            response.status(status).send(YAML.stringify(data));
        },
        yaml: () => {
            response.setHeader('Content-Type', 'application/yaml');
            response.status(status).send(YAML.stringify(data));
        },
        default: () => {
            response.status(status).json(data);
        }
    })
}
