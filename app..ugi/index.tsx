import { Text, View } from "react-native";
import {TabBarIcon} from "../components/navigation/TabBarIcon"
export default function Index() {
  return (
    <View style={{flex: 1,justifyContent: "center",alignItems: "center",}}>
      <Text>sex app/index.tsx to edit this screen.</Text>
      <TabBarIcon name={"home"}/>
    </View>
  );
}
