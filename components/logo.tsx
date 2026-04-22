import clsx from "clsx";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { View } from "react-native";

const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const logoSource = require("../assets/images/icon.png");

type LogoProps = {
    className?: string;
};

const Logo = ({ className = "h-10 w-10" }: LogoProps) => {
    return (
        <View className={clsx("rounded-full", className)}>
            <Link href={"/"}>
                <Image
                    source={logoSource}
                    placeholder={{ blurhash }}
                    transition={250}
                    style={{ width: "100%", height: "100%" }}
                />
            </Link>
        </View>
    );
};

export default Logo;
