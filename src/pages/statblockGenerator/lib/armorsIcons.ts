import mage from 'shared/assets/images/armors/120px-Rolans_Mage_Armour_Icon.webp.png';
import natural from 'shared/assets/images/armors/50px-Draconic_Resilience_Icon.webp.png';
import other from 'shared/assets/images/armors/50px-Shield_of_Faith_Icon.webp.png';
import none from 'shared/assets/images/armors/50px-Unarmoured_Defence_Barbarian_Icon.webp.png';
import breastplate from 'shared/assets/images/armors/Breastplate_Unfaded_Icon.png';
import chainMail from 'shared/assets/images/armors/Chain_Mail_2_Unfaded_Icon.png';
import chainShirt from 'shared/assets/images/armors/Chain_Shirt_3_Unfaded_Icon.png';
import halfPlate from 'shared/assets/images/armors/Half_Plate_Unfaded_Icon.png';
import hide from 'shared/assets/images/armors/Hide_Armour_Unfaded_Icon.png';
import leather from 'shared/assets/images/armors/Leather_Armour_3_Unfaded_Icon.png';
import padded from 'shared/assets/images/armors/Padded_Armour_3_Unfaded_Icon.png';
import plate from 'shared/assets/images/armors/Plate_Armour_Unfaded_Icon.png';
import ringMail from 'shared/assets/images/armors/Ring_Mail_Unfaded_Icon.png';
import scaleMail from 'shared/assets/images/armors/Scale_Mail_Unfaded_Icon.png';
import splint from 'shared/assets/images/armors/Splint_Mail_Unfaded_Icon.png';
import studded from 'shared/assets/images/armors/Studded_Leather_Unfaded_Icon.png';
import { ArmorType } from './armorClassUtils';

export const armorIcons: Record<ArmorType, string> = {
  none: none,
  natural: natural,
  mage: mage,
  padded: padded,
  leather: leather,
  studded: studded,
  hide: hide,
  chainShirt: chainShirt,
  scaleMail: scaleMail,
  breastplate: breastplate,
  halfPlate: halfPlate,
  ringMail: ringMail,
  chainMail: chainMail,
  splint: splint,
  plate: plate,
  other: other,
};
