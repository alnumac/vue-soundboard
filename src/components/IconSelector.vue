<template>
<Button v-bind="$attrs" @click="toggleOverlay" class="p-button-outlined p-button-raised p-button-plain">
  <SvgIcon type="mdi" :size="36" :path="modelValue" />
</Button>
<OverlayPanel ref="overlay" :showCloseIcon="true" :dismissable="true" appendTo="body" class="overlay">
  <div class="grid overlay-content">
    <Button
      v-for="icon in icons"
      :key="icon"
      @click="selectIcon(icon)"
      :class="['p-button-plain', (icon === modelValue) ? 'p-button-outlined' : 'p-button-text']"
    >
      <SvgIcon type="mdi" :size="36" :path="icon" />
    </Button>
  </div>
</OverlayPanel>
</template>

<script>
//ref, reactive, toRefs, computed, watch, onMounted, onUpdated, onUnmounted
import { ref } from 'vue'
import Button from 'primevue/button';
import OverlayPanel from 'primevue/overlaypanel';
import SvgIcon from '@jamescoyle/vue-icon'
import { 
  mdiAccount, mdiAccountGroup, mdiAccountMusic, mdiAirHorn, mdiAirballoon, mdiAlarm, mdiAlarmLight, mdiAlbum, mdiAlert, mdiAlertOctagon, mdiAlien, mdiAllInclusive, mdiAmmunition, mdiAmplifier, mdiAnchor, mdiAndroidStudio, mdiAnvil, mdiAppleIcloud, mdiAppleSafari, mdiArchive, mdiArmFlex, mdiAssistant, mdiAsterisk, mdiAtom, mdiAtomVariant, mdiAudioVideo, mdiAutoFix, mdiAvTimer, mdiAxe, mdiBabyCarriage, mdiBabyFace, mdiBacteria, mdiBadminton, mdiBagSuitcase, mdiBagPersonal, mdiBaguette, mdiBalloon, mdiBandage, mdiBank, mdiBarley, mdiBarn, mdiBarrel, mdiBaseballDiamond, mdiBasketball, mdiBat, mdiBattery, mdiBatteryCharging20, mdiBatteryHeartVariant, mdiBatteryPlus, mdiBeach, mdiBeaker, mdiBed, mdiBee, mdiBeeFlower, mdiBeehiveOutline, mdiBeer, mdiBell, mdiBellRing, mdiBiathlon, mdiBicyclePennyFarthing, mdiBilliards, mdiBiohazard, mdiBird, mdiBloodBag, mdiBlur, mdiBolnisiCross, mdiBomb, mdiBone, mdiBookOpenPageVariant, mdiBookshelf, mdiBoombox, mdiBoomerang, mdiBottleSoda, mdiBottleTonic, mdiBottleTonicPlus, mdiBottleTonicSkull, mdiBottleWine, mdiBowTie, mdiBowlMix, mdiBoxingGlove, mdiBrain, mdiBridge, mdiBriefcase, mdiBriefcaseVariant, mdiBrightness1, mdiBrightness3, mdiBrightness5, mdiBroadcast, mdiBroom, mdiBrush, mdiBucket, mdiBug, mdiBugle, mdiBullet, mdiBulletinBoard, mdiBullhorn, mdiBullseye, mdiBullseyeArrow, mdiButterfly, mdiCactus, mdiCake, mdiCalendar, mdiCallMerge, mdiCallSplit, mdiCamera, mdiCameraControl, mdiCameraIris, mdiCampfire, mdiCancel, mdiCandle, mdiCandycane, mdiCaravan, mdiCards, mdiCardsClub, mdiCardsDiamond, mdiCardsHeart, mdiCardsSpade, mdiCarrot, mdiCash, mdiCastle, mdiCat, mdiCelticCross, mdiCertificate, mdiChartBarStacked, mdiChartBubble, mdiChartLineVariant, mdiChartTimelineVariantShimmer, mdiChat, mdiChatAlert, mdiChatProcessing, mdiChatSleep, mdiCheckDecagram, mdiCheckboxMarkedCircle, mdiCheckerboard, mdiCheese, mdiChefHat, mdiChemicalWeapon, mdiChessBishop, mdiChessKing, mdiChessQueen, mdiChessRook, mdiChiliMild, mdiChurch, mdiCircleExpand, mdiCity, mdiClippy, mdiClock, mdiCloseOctagon, mdiCloud, mdiClover, mdiCoachLamp, mdiCoffee, mdiCoffin, mdiCog, mdiCogs, mdiCompass, mdiCompassRose, mdiConcourseCi, mdiConnection, mdiControllerClassic, mdiCookie, mdiCorn, mdiCosineWave, mdiCow, mdiCreation, mdiCrown, mdiCrystalBall, mdiCubeSend, mdiCupcake, mdiCursorDefaultClick, mdiCursorPointer, mdiDanceBallroom, mdiDeathStar, mdiDeathStarVariant, mdiDeathlyHallows, mdiDesk, mdiDiamondStone, mdiDiceD20, mdiDiceMultiple, mdiDisc, mdiDiscAlert, mdiDivingFlippers, mdiDivingHelmet, mdiDna, mdiDog, mdiDogSide, mdiDominoMask, mdiDonkey, mdiDoor, mdiDoorClosedLock, mdiDoorOpen, mdiDramaMasks, mdiDuck, mdiDumbbell, mdiEarHearing, mdiEarHearingOff, mdiEarth, mdiEarthBox, mdiEgg, mdiEggEaster, mdiElephant, mdiEmail, mdiEmoticon, mdiEmoticonAngry, mdiEmoticonConfused, mdiEmoticonCry, mdiEmoticonDevil, mdiEmoticonPoop, mdiEmoticonSad, mdiEngine, mdiEqualizer, mdiExitRun, mdiEye, mdiEyeCircle, mdiEyeOff, mdiEyeSettings, mdiFaceWoman, mdiFactory, mdiFamilyTree, mdiFan, mdiFeather, mdiFencing, mdiFerry, mdiFilePresentationBox, mdiFilmstrip, mdiFingerprint, mdiFire, mdiFireplace, mdiFireplaceOff, mdiFirework, mdiFish, mdiFlag, mdiFlare, mdiFlash, mdiFlashlight, mdiFlask, mdiFlaskRoundBottom, mdiFlaskRoundBottomEmptyOutline, mdiFloorPlan, mdiFlower, mdiFlowerTulip, mdiFoodApple, mdiFoodCroissant, mdiFoodDrumstick, mdiFoodTurkey, mdiFootPrint, mdiFountain, mdiFountainPen, mdiFuel, mdiFuse, mdiGate, mdiGavel, mdiGhost, mdiGift, mdiGlassCocktail, mdiGlassMugVariant, mdiGlassWine, mdiGlobeModel, mdiGold, mdiGrass, mdiGrill, mdiGuitarAcoustic, mdiHalloween, mdiHammer, mdiHandRight, mdiHandcuffs, mdiHatFedora, mdiHeadCog, mdiHeadphones, mdiHeart, mdiHeartBroken, mdiHeartFlash, mdiHeartPulse, mdiHelpCircle, mdiHiking, mdiHome, mdiHomeAlert, mdiHomeVariant, mdiHook, mdiHops, mdiHorse, mdiHorseVariant, mdiHorseshoe, mdiHotTub, mdiIceCream, mdiImageFilterHdr, mdiIncognito, mdiIsland, mdiJellyfish, mdiKabaddi, mdiKey, mdiKeyChain, mdiKnife, mdiKnifeMilitary, mdiKoala, mdiLadybug, mdiLaserPointer, mdiLasso, mdiLeaf, mdiLeafMaple, mdiLifebuoy, mdiLightSwitch, mdiLightningBolt, mdiLipstick, mdiLock, mdiLockOpen, mdiLooks, mdiLotionPlus, mdiLungs, mdiMagnet, mdiMagnify, mdiMap, mdiMapMarker, mdiMapMarkerQuestion, mdiMathCompass, mdiMeditation, mdiMetronome, mdiMine, mdiMirror, mdiMoonFull, mdiMoonWaxingCrescent, mdiMotherHeart, mdiMotherNurse, mdiMotion, mdiMovieOpen, mdiMushroom, mdiMusic, mdiMusicNote, mdiMustache, mdiNature, mdiNaturePeople, mdiNecklace, mdiNinja, mdiNoodles, mdiNuke, mdiOar, mdiOcarina, mdiOilLamp, mdiOrnament, mdiPalette, mdiPalmTree, mdiPanda, mdiPaperRoll, mdiPartyPopper, mdiPassportBiometric, mdiPause, mdiPaw, mdiPeace, mdiPeanut, mdiPenguin, mdiPentagram, mdiPhone, mdiPiano, mdiPickaxe, mdiPier, mdiPig, mdiPill, mdiPillar, mdiPineTree, mdiPineTreeFire, mdiPinwheel, mdiPipe, mdiPipeLeak, mdiPirate, mdiPistol, mdiPitchfork, mdiPlayCircle, mdiPlaylistMusic, mdiPokeball, mdiPoliceBadge, mdiPool, mdiPotSteam, mdiPower, mdiPulse, mdiPuzzle, mdiRabbit, mdiRadar, mdiRadio, mdiRadioactive, mdiRailroadLight, mdiRake, mdiReorderVertical, mdiRhombusSplit, mdiRice, mdiRing, mdiRobot, mdiRobotAngry, mdiRocket, mdiRodent, mdiRoomService, mdiRun, mdiSack, mdiSaxophone, mdiScaleBalance, mdiSchool, mdiSailBoat, mdiSafeSquare, mdiSatelliteVariant, mdiSausage, mdiScriptText, mdiSeat, mdiSecurity, mdiSeed, mdiSeesaw, mdiSharkFin, mdiSheep, mdiShield, mdiShieldCross, mdiShieldHome, mdiShieldSun, mdiShipWheel, mdiShoePrint, mdiShore, mdiShovel, mdiShuriken, mdiSignDirection, mdiSignRealEstate, mdiSignText, mdiSilo, mdiSilverwareClean, mdiSki, mdiSkiWater, mdiSkull, mdiSkullCrossbones, mdiSmog, mdiSleep, mdiSmokingPipe, mdiSnail, mdiSnake, mdiSnowflake, mdiSnowflakeMelt, mdiSnowman, mdiSolarPower, mdiSoySauce, mdiSpa, mdiSpeedometer, mdiSpider, mdiSpiderWeb, mdiSprout, mdiStadium, mdiStadiumVariant, mdiStairs, mdiStar, mdiStarFace, mdiStarFourPoints, mdiStomach, mdiStore, mdiStorefrontOutline, mdiStrategy, mdiSubmarine, mdiSummit, mdiSwim, mdiSword, mdiSwordCross, mdiTaco, mdiTarget, mdiTea, mdiTelescope, mdiTent, mdiTerrain, mdiTestTube, mdiThermometerAlert, mdiTorch, mdiTortoise, mdiTournament, mdiTree, mdiTriforce, mdiTrophy, mdiTrumpet, mdiTurkey, mdiUfoOutline, mdiUmbrella, mdiUnicorn, mdiUntappd, mdiVanish, mdiVirus, mdiVolumeHigh, mdiWater, mdiWaterAlert, mdiWaterWell, mdiWave, mdiWaveform, mdiWaves, mdiWeatherHurricane, mdiWeatherCloudy, mdiWeatherFog, mdiWeatherLightning, mdiWeatherNight, mdiWeatherPouring, mdiWeatherSnowyHeavy, mdiWeatherSunny, mdiWeatherSunset, mdiWeatherTornado, mdiWeatherWindy, mdiWindowClosedVariant, mdiWizardHat, mdiYurt
} from '@mdi/js'

export default {
  components: {
    SvgIcon,
    Button,
    OverlayPanel
  },
  props: {
    modelValue: {
      type: String,
      required: true
    }
  },
  emits: [
    'update:modelValue'
  ],
  setup(props, context) {
    const overlay = ref(null)
    function toggleOverlay(event) {
      overlay.value.toggle(event)
    }
    function selectIcon(icon) {
      context.emit("update:modelValue", icon)
    }
    const icons =  [
      mdiAccount, mdiAccountGroup, mdiAccountMusic, mdiAirHorn, mdiAirballoon, mdiAlarm, mdiAlarmLight, mdiAlbum, mdiAlert, mdiAlertOctagon, mdiAlien, mdiAllInclusive, mdiAmmunition, mdiAmplifier, mdiAnchor, mdiAndroidStudio, mdiAnvil, mdiAppleIcloud, mdiAppleSafari, mdiArchive, mdiArmFlex, mdiAssistant, mdiAsterisk, mdiAtom, mdiAtomVariant, mdiAudioVideo, mdiAutoFix, mdiAvTimer, mdiAxe, mdiBabyCarriage, mdiBabyFace, mdiBacteria, mdiBadminton, mdiBagSuitcase, mdiBagPersonal, mdiBaguette, mdiBalloon, mdiBandage, mdiBank, mdiBarley, mdiBarn, mdiBarrel, mdiBaseballDiamond, mdiBasketball, mdiBat, mdiBattery, mdiBatteryCharging20, mdiBatteryHeartVariant, mdiBatteryPlus, mdiBeach, mdiBeaker, mdiBed, mdiBee, mdiBeeFlower, mdiBeehiveOutline, mdiBeer, mdiBell, mdiBellRing, mdiBiathlon, mdiBicyclePennyFarthing, mdiBilliards, mdiBiohazard, mdiBird, mdiBloodBag, mdiBlur, mdiBolnisiCross, mdiBomb, mdiBone, mdiBookOpenPageVariant, mdiBookshelf, mdiBoombox, mdiBoomerang, mdiBottleSoda, mdiBottleTonic, mdiBottleTonicPlus, mdiBottleTonicSkull, mdiBottleWine, mdiBowTie, mdiBowlMix, mdiBoxingGlove, mdiBrain, mdiBridge, mdiBriefcase, mdiBriefcaseVariant, mdiBrightness1, mdiBrightness3, mdiBrightness5, mdiBroadcast, mdiBroom, mdiBrush, mdiBucket, mdiBug, mdiBugle, mdiBullet, mdiBulletinBoard, mdiBullhorn, mdiBullseye, mdiBullseyeArrow, mdiButterfly, mdiCactus, mdiCake, mdiCalendar, mdiCallMerge, mdiCallSplit, mdiCamera, mdiCameraControl, mdiCameraIris, mdiCampfire, mdiCancel, mdiCandle, mdiCandycane, mdiCaravan, mdiCards, mdiCardsClub, mdiCardsDiamond, mdiCardsHeart, mdiCardsSpade, mdiCarrot, mdiCash, mdiCastle, mdiCat, mdiCelticCross, mdiCertificate, mdiChartBarStacked, mdiChartBubble, mdiChartLineVariant, mdiChartTimelineVariantShimmer, mdiChat, mdiChatAlert, mdiChatProcessing, mdiChatSleep, mdiCheckDecagram, mdiCheckboxMarkedCircle, mdiCheckerboard, mdiCheese, mdiChefHat, mdiChemicalWeapon, mdiChessBishop, mdiChessKing, mdiChessQueen, mdiChessRook, mdiChiliMild, mdiChurch, mdiCircleExpand, mdiCity, mdiClippy, mdiClock, mdiCloseOctagon, mdiCloud, mdiClover, mdiCoachLamp, mdiCoffee, mdiCoffin, mdiCog, mdiCogs, mdiCompass, mdiCompassRose, mdiConcourseCi, mdiConnection, mdiControllerClassic, mdiCookie, mdiCorn, mdiCosineWave, mdiCow, mdiCreation, mdiCrown, mdiCrystalBall, mdiCubeSend, mdiCupcake, mdiCursorDefaultClick, mdiCursorPointer, mdiDanceBallroom, mdiDeathStar, mdiDeathStarVariant, mdiDeathlyHallows, mdiDesk, mdiDiamondStone, mdiDiceD20, mdiDiceMultiple, mdiDisc, mdiDiscAlert, mdiDivingFlippers, mdiDivingHelmet, mdiDna, mdiDog, mdiDogSide, mdiDominoMask, mdiDonkey, mdiDoor, mdiDoorClosedLock, mdiDoorOpen, mdiDramaMasks, mdiDuck, mdiDumbbell, mdiEarHearing, mdiEarHearingOff, mdiEarth, mdiEarthBox, mdiEgg, mdiEggEaster, mdiElephant, mdiEmail, mdiEmoticon, mdiEmoticonAngry, mdiEmoticonConfused, mdiEmoticonCry, mdiEmoticonDevil, mdiEmoticonPoop, mdiEmoticonSad, mdiEngine, mdiEqualizer, mdiExitRun, mdiEye, mdiEyeCircle, mdiEyeOff, mdiEyeSettings, mdiFaceWoman, mdiFactory, mdiFamilyTree, mdiFan, mdiFeather, mdiFencing, mdiFerry, mdiFilePresentationBox, mdiFilmstrip, mdiFingerprint, mdiFire, mdiFireplace, mdiFireplaceOff, mdiFirework, mdiFish, mdiFlag, mdiFlare, mdiFlash, mdiFlashlight, mdiFlask, mdiFlaskRoundBottom, mdiFlaskRoundBottomEmptyOutline, mdiFloorPlan, mdiFlower, mdiFlowerTulip, mdiFoodApple, mdiFoodCroissant, mdiFoodDrumstick, mdiFoodTurkey, mdiFootPrint, mdiFountain, mdiFountainPen, mdiFuel, mdiFuse, mdiGate, mdiGavel, mdiGhost, mdiGift, mdiGlassCocktail, mdiGlassMugVariant, mdiGlassWine, mdiGlobeModel, mdiGold, mdiGrass, mdiGrill, mdiGuitarAcoustic, mdiHalloween, mdiHammer, mdiHandRight, mdiHandcuffs, mdiHatFedora, mdiHeadCog, mdiHeadphones, mdiHeart, mdiHeartBroken, mdiHeartFlash, mdiHeartPulse, mdiHelpCircle, mdiHiking, mdiHome, mdiHomeAlert, mdiHomeVariant, mdiHook, mdiHops, mdiHorse, mdiHorseVariant, mdiHorseshoe, mdiHotTub, mdiIceCream, mdiImageFilterHdr, mdiIncognito, mdiIsland, mdiJellyfish, mdiKabaddi, mdiKey, mdiKeyChain, mdiKnife, mdiKnifeMilitary, mdiKoala, mdiLadybug, mdiLaserPointer, mdiLasso, mdiLeaf, mdiLeafMaple, mdiLifebuoy, mdiLightSwitch, mdiLightningBolt, mdiLipstick, mdiLock, mdiLockOpen, mdiLooks, mdiLotionPlus, mdiLungs, mdiMagnet, mdiMagnify, mdiMap, mdiMapMarker, mdiMapMarkerQuestion, mdiMathCompass, mdiMeditation, mdiMetronome, mdiMine, mdiMirror, mdiMoonFull, mdiMoonWaxingCrescent, mdiMotherHeart, mdiMotherNurse, mdiMotion, mdiMovieOpen, mdiMushroom, mdiMusic, mdiMusicNote, mdiMustache, mdiNature, mdiNaturePeople, mdiNecklace, mdiNinja, mdiNoodles, mdiNuke, mdiOar, mdiOcarina, mdiOilLamp, mdiOrnament, mdiPalette, mdiPalmTree, mdiPanda, mdiPaperRoll, mdiPartyPopper, mdiPassportBiometric, mdiPause, mdiPaw, mdiPeace, mdiPeanut, mdiPenguin, mdiPentagram, mdiPhone, mdiPiano, mdiPickaxe, mdiPier, mdiPig, mdiPill, mdiPillar, mdiPineTree, mdiPineTreeFire, mdiPinwheel, mdiPipe, mdiPipeLeak, mdiPirate, mdiPistol, mdiPitchfork, mdiPlayCircle, mdiPlaylistMusic, mdiPokeball, mdiPoliceBadge, mdiPool, mdiPotSteam, mdiPower, mdiPulse, mdiPuzzle, mdiRabbit, mdiRadar, mdiRadio, mdiRadioactive, mdiRailroadLight, mdiRake, mdiReorderVertical, mdiRhombusSplit, mdiRice, mdiRing, mdiRobot, mdiRobotAngry, mdiRocket, mdiRodent, mdiRoomService, mdiRun, mdiSack, mdiSaxophone, mdiScaleBalance, mdiSchool, mdiSailBoat, mdiSafeSquare, mdiSatelliteVariant, mdiSausage, mdiScriptText, mdiSeat, mdiSecurity, mdiSeed, mdiSeesaw, mdiSharkFin, mdiSheep, mdiShield, mdiShieldCross, mdiShieldHome, mdiShieldSun, mdiShipWheel, mdiShoePrint, mdiShore, mdiShovel, mdiShuriken, mdiSignDirection, mdiSignRealEstate, mdiSignText, mdiSilo, mdiSilverwareClean, mdiSki, mdiSkiWater, mdiSkull, mdiSkullCrossbones, mdiSmog, mdiSleep, mdiSmokingPipe, mdiSnail, mdiSnake, mdiSnowflake, mdiSnowflakeMelt, mdiSnowman, mdiSolarPower, mdiSoySauce, mdiSpa, mdiSpeedometer, mdiSpider, mdiSpiderWeb, mdiSprout, mdiStadium, mdiStadiumVariant, mdiStairs, mdiStar, mdiStarFace, mdiStarFourPoints, mdiStomach, mdiStore, mdiStorefrontOutline, mdiStrategy, mdiSubmarine, mdiSummit, mdiSwim, mdiSword, mdiSwordCross, mdiTaco, mdiTarget, mdiTea, mdiTelescope, mdiTent, mdiTerrain, mdiTestTube, mdiThermometerAlert, mdiTorch, mdiTortoise, mdiTournament, mdiTree, mdiTriforce, mdiTrophy, mdiTrumpet, mdiTurkey, mdiUfoOutline, mdiUmbrella, mdiUnicorn, mdiUntappd, mdiVanish, mdiVirus, mdiVolumeHigh, mdiWater, mdiWaterAlert, mdiWaterWell, mdiWave, mdiWaveform, mdiWaves, mdiWeatherHurricane, mdiWeatherCloudy, mdiWeatherFog, mdiWeatherLightning, mdiWeatherNight, mdiWeatherPouring, mdiWeatherSnowyHeavy, mdiWeatherSunny, mdiWeatherSunset, mdiWeatherTornado, mdiWeatherWindy, mdiWindowClosedVariant, mdiWizardHat, mdiYurt
    ]
    return {
      overlay,
      toggleOverlay,
      selectIcon,
      icons
    }
  },
}
</script>

<style scoped>
.overlay-content {
  max-height: 300px;
  overflow-y: scroll;
  overflow-x: hidden;
}

.grid {
  display: grid;
  grid-template-columns: repeat(5, 72px);
}
.grid>div {
  padding: 18px;
}
</style>