import React from 'react'
import Button from "@material-ui/core/Button";

const CustomButton=(props)=>{
return(
    <Button
        onClick={props.onClick}
        color={props.color}
        variant={props.variant}
        disabled={props.disabled}
    >
        {props.children}
    </Button>
)
}
export default CustomButton