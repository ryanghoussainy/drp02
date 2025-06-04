import React from 'react';
import {
    AntDesign,
    Entypo,
    EvilIcons,
    Feather,
    FontAwesome,
    FontAwesome5,
    FontAwesome6,
    Fontisto,
    Foundation,
    Ionicons,
    MaterialCommunityIcons,
    MaterialIcons,
    Octicons,
    SimpleLineIcons,
    Zocial
} from '@expo/vector-icons';
import { ICON_FAMILIES } from '../constants/iconFamilies';

type IconProps = {
    name: string;
    family: ICON_FAMILIES;
    size: number;
    color: string;
};

export default function CustomIcon({ name, family, size, color }: IconProps) {
    if (family === 'AntDesign') {
        return <AntDesign name={name as keyof typeof AntDesign.glyphMap} size={size} color={color} />;
    } else if (family === 'Entypo') {
        return <Entypo name={name as keyof typeof Entypo.glyphMap} size={size} color={color} />;
    } else if (family === 'EvilIcons') {
        return <EvilIcons name={name as keyof typeof EvilIcons.glyphMap} size={size} color={color} />;
    } else if (family === 'Feather') {
        return <Feather name={name as keyof typeof Feather.glyphMap} size={size} color={color} />;
    } else if (family === 'FontAwesome') {
        return <FontAwesome name={name as keyof typeof FontAwesome.glyphMap} size={size} color={color} />;
    } else if (family === 'FontAwesome5') {
        return <FontAwesome5 name={name as keyof typeof FontAwesome5.glyphMap} size={size} color={color} />;
    } else if (family === 'FontAwesome6') {
        return <FontAwesome6 name={name as keyof typeof FontAwesome6.glyphMap} size={size} color={color} />;
    } else if (family === 'Fontisto') {
        return <Fontisto name={name as keyof typeof Fontisto.glyphMap} size={size} color={color} />;
    } else if (family === 'Foundation') {
        return <Foundation name={name as keyof typeof Foundation.glyphMap} size={size} color={color} />;
    } else if (family === 'Ionicons') {
        return <Ionicons name={name as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
    } else if (family === 'MaterialCommunityIcons') {
        return <MaterialCommunityIcons name={name as keyof typeof MaterialCommunityIcons.glyphMap} size={size} color={color} />;
    } else if (family === 'MaterialIcons') {
        return <MaterialIcons name={name as keyof typeof MaterialIcons.glyphMap} size={size} color={color} />;
    } else if (family === 'Octicons') {
        return <Octicons name={name as keyof typeof Octicons.glyphMap} size={size} color={color} />;
    } else if (family === 'SimpleLineIcons') {
        return <SimpleLineIcons name={name as keyof typeof SimpleLineIcons.glyphMap} size={size} color={color} />;
    } else if (family === 'Zocial') {
        return <Zocial name={name as keyof typeof Zocial.glyphMap} size={size} color={color} />;
    }
    return null;
}
