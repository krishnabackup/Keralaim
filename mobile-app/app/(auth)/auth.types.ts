export type RegisterBody = {
    name? : string,
    dob? : string,
    district? : string,
    email? : string,
    password? : string
}

export interface RegisterRequest  {
    name : string,
    dob : string,
    district : string,
    email : string,
    password : string
}
export type InputProps = {
    placeholder : string;
    secureTextEntry? : boolean;
    name : string;
    setRegisterBody : React.Dispatch<React.SetStateAction<RegisterBody>>
}

