import React, { PropsWithChildren, useEffect, useState } from "react";
import Avatar from "avataaars";
interface avatorConfig {
  topTypeIndex: number; //35个
  accessoriesTypeIndex: number; //7个
  facialHairTypeIndex: number; //6个
  facialHairColorIndex: number; //8个
  clotheTypeIndex: number; //9个
  clotheColorIndex: number; //14个
  eyeTypeIndex: number; //12个
  eyebrowTypeIndex: number; //12个
  mouthTypeIndex: number; //12个
  skinColorIndex: number; //7个
}

const Avator: React.FC<avatorConfig> = (
  props: PropsWithChildren<avatorConfig>
) => {
  const topTypeArr: Array<string> = [
    "NoHair",
    "Eyepatch",
    "Hat",
    "Hijab",
    "Turban",
    "WinterHat1",
    "WinterHat2",
    "WinterHat3",
    "WinterHat4",
    "LongHairBigHair",
    "LongHairBob",
    "LongHairBun",
    "LongHairCurly",
    "LongHairCurvy",
    "LongHairDreads",
    "LongHairFrida",
    "LongHairFro",
    "LongHairFroBand",
    "LongHairNotTooLong",
    "LongHairShavedSides",
    "LongHairMiaWallace",
    "LongHairStraight",
    "LongHairStraight2",
    "LongHairStraightStrand",
    "ShortHairDreads01",
    "ShortHairDreads02",
    "ShortHairFrizzle",
    "ShortHairShaggyMullet",
    "ShortHairShortCurly",
    "ShortHairShortFlat",
    "ShortHairShortRound",
    "ShortHairShortWaved",
    "ShortHairSides",
    "ShortHairTheCaesar",
    "ShortHairTheCaesarSide",
  ];
  const accessoriesTypeArr: Array<string> = [
    "Blank",
    "Kurt",
    "Prescription01",
    "Prescription02",
    "Round",
    "Sunglasses",
    "Wayfarers",
  ];
  const facialHairTypeArr: Array<string> = [
    "Blank",
    "BeardMedium",
    "BeardLight",
    "BeardMajestic",
    "MoustacheFancy",
    "MoustacheMagnum",
  ];
  const facialHairColorArr = [
    "Auburn",
    "Black",
    "Blonde",
    "BlondeGolden",
    "Brown",
    "BrownDark",
    "Platinum",
    "Red",
  ];
  const clotheTypeArr = [
    "BlazerShirt",
    "BlazerSweater",
    "CollarSweater",
    "GraphicShirt",
    "Hoodie",
    "Overall",
    "ShirtCrewNeck",
    "ShirtScoopNeck",
    "ShirtVNeck",
  ];
  const clotheColorArr = [
    "Black",
    "Blue01",
    "Blue02",
    "Blue03",
    "Gray01",
    "Gray02",
    "Heather",
    "PastelBlue",
    "PastelGreen",
    "PastelOrange",
    "PastelRed",
    "PastelYellow",
    "Pink",
    "Red",
    "White",
  ];
  const eyeTypeArr = [
    "Close",
    "Cry",
    "Default",
    "Dizzy",
    "EyeRoll",
    "Happy",
    "Hearts",
    "Side",
    "Squint",
    "Surprised",
    "Wink",
    "WinkWacky",
  ];
  const eyebrowTypeArr = [
    "Angry",
    "AngryNatural",
    "Default",
    "DefaultNatural",
    "FlatNatural",
    "RaisedExcited",
    "RaisedExcitedNatural",
    "SadConcerned",
    "SadConcernedNatural",
    "UnibrowNatural",
    "UpDown",
    "UpDownNatural",
  ];
  const mouthTypeArr = [
    "Concerned",
    "Default",
    "Disbelief",
    "Eating",
    "Grimace",
    "Sad",
    "ScreamOpen",
    "Serious",
    "Smile",
    "Tongue",
    "Twinkle",
    "Vomit",
  ];
  const skinColorArr = [
    "Tanned",
    "Yellow",
    "Pale",
    "Light",
    "Brown",
    "DarkBrown",
    "Black",
  ];
  let config = {
    topType: topTypeArr[props.topTypeIndex],
    accessoriesType: accessoriesTypeArr[props.accessoriesTypeIndex],
    facialHairType: facialHairTypeArr[props.facialHairTypeIndex],
    facialHairColor: facialHairColorArr[props.facialHairColorIndex],
    clotheType: clotheTypeArr[props.clotheTypeIndex],
    clotheColor: clotheColorArr[props.clotheColorIndex],
    eyeType: eyeTypeArr[props.eyeTypeIndex],
    eyebrowType: eyebrowTypeArr[props.eyebrowTypeIndex],
    mouthType: mouthTypeArr[props.mouthTypeIndex],
    skinColor: skinColorArr[props.skinColorIndex],
  };
  return (
    <div>
      <Avatar
        avatarStyle="Circle"
        {...config}
        style={{ width: "120px", height: "120px" }}
      />
    </div>
  );
};
export default Avator;
