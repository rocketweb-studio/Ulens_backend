import { add } from "date-fns";
import {v4 as uuidv4} from 'uuid';

export class User {
    confirmationCode?: string
    confCodeExpDate?: string
    confCodeConfirmed?: boolean
    recoveryCode?: string
    recCodeExpDate?: string
    recCodeConfirmed?: boolean

    constructor(
        public userName: string,
        public email: string,
        public passwordHash: string
    ){
        this.confirmationCode = uuidv4();
        this.confCodeExpDate = add (new Date(), {
                            hours:1,
                            minutes: 3
        }).toISOString();
        this.confCodeConfirmed = false;
        this.recoveryCode = uuidv4();
        this.recCodeExpDate = add (new Date(), {
                hours:1,
                minutes: 3
            }).toISOString(),
        this.recCodeConfirmed = false;
    }
}