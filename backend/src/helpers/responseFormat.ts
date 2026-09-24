export const success = (message : string , data? : any) => ({
    success : true,
    message : message,
    data : data
});

export const error = (message : string ) => ({
        sucess : false,
        message : message
});