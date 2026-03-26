import { Image, ImageSourcePropType } from "react-native"

export default function AppIcons ({name , color = "#0000" } : {name : ImageSourcePropType , color? : string}){
return <Image
  source={name}
  style={{ width: 28, height: 28, tintColor: color }}
/>
}