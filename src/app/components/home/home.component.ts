import { Component, OnInit, OnDestroy, ChangeDetectorRef, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../shared/language.service';
import { Navbar } from '../navbar/navbar';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';

interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface GuestInfo {
  name: string;
  starter: string;
  mainCourse: string;
}

interface Translations {
  saveTheDate: string;
  details: string;
  timeline: string;
  rsvp: string;
  weddingDate: string;
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  saveTheDateSection: string;
  timelineSection: string;
  detailsSection: string;
  rsvpSection: string;
  rsvpSubtitle: string;
  addToCalendar: string;
  googleCalendar: string;
  outlookCalendar: string;
  appleCalendar: string;
  welcomeMessage: string;
  welcomePara1: string;
  welcomePara2: string;
  welcomePara3: string;
  welcomeClosing: string;
  welcomeNames: string;
  rsvpName: string;
  rsvpAttending: string;
  rsvpAttendingYes: string;
  rsvpAttendingNo: string;
  rsvpGuests: string;
  rsvpStarter: string;
  rsvpStarterSoup: string;
  rsvpStarterPasta: string;
  rsvpMain: string;
  rsvpMainChicken: string;
  rsvpMainFish: string;
  rsvpMainSteak: string;
  rsvpMainVeg: string;
  rsvpDessert: string;
  rsvpDessertItem: string;
  rsvpMainKid: string;
  rsvpYourMenu: string;
  rsvpCompanionTitle: string;
  rsvpCompanionName: string;
  rsvpDietary: string;
  rsvpMessage: string;
  rsvpSubmit: string;
  rsvpSuccess: string;
  rsvpError: string;
  rsvpDeadline: string;
  detailsCeremony: string;
  detailsReception: string;
  timelineThe: string;
  timelineWedding: string;
  timelineDay: string;
  timelineScript: string;
  timelineTime1: string;
  timelineTime2: string;
  timelineTime3: string;
  timelineTime4: string;
  timelineTime5: string;
  timelineTime6: string;
  timelineEvent1: string;
  timelineEvent2: string;
  timelineEvent3: string;
  timelineEvent4: string;
  timelineEvent5: string;
  timelineEvent6: string;
  dressCodeTitle: string;
  dressCodePara1: string;
  dressCodePara2: string;
  parkingTitle: string;
  parkingPara: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  countdown: Countdown = {
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  };

  rsvpForm = {
    name: '',
    attending: '',
    totalGuests: 1,
    myStarter: '',
    myMainCourse: '',
    companions: [] as GuestInfo[],
    dietary: '',
    message: ''
  };
  rsvpSubmitting = false;
  rsvpSubmitted = false;
  rsvpErrored = false;

  translations: { [key: string]: Translations } = {
    en: {
      saveTheDate: 'Save the Date',
      details: 'Details',
      timeline: 'Timeline',
      rsvp: 'RSVP',
      weddingDate: 'October 10, 2026',
      days: 'Days',
      hours: 'Hours',
      minutes: 'Minutes',
      seconds: 'Seconds',
      saveTheDateSection: 'Save the Date',
      timelineSection: 'Timeline',
      detailsSection: 'Wedding Details',
      rsvpSection: 'RSVP',
      rsvpSubtitle: 'Please respond by September 1st, 2026. After that date, no response will be considered as not attending.',
      addToCalendar: 'Add to Your Calendar',
      googleCalendar: 'Google Calendar',
      outlookCalendar: 'Outlook',
      appleCalendar: 'Apple Calendar',
      welcomeMessage: 'You are invited',
      welcomePara1: 'We\'re so delighted you\'re here and can\'t wait to celebrate this special moment with you.',
      welcomePara2: 'This space has been thoughtfully created to guide you through all the details as our wedding approaches, from venue information and RSVP to the event schedule and other essentials.',
      welcomePara3: 'Having you with us on this day means everything, and we\'re truly excited to share these moments, laughter, and memories together.',
      welcomeClosing: 'With all our love,',
      welcomeNames: 'Kaige & Melina',
      rsvpName: 'Full Name',
      rsvpAttending: 'Will you be attending?',
      rsvpAttendingYes: 'Joyfully accepts',
      rsvpAttendingNo: 'Regretfully declines',
      rsvpGuests: 'Number of guests (including yourself)',
      rsvpStarter: 'Starter',
      rsvpStarterSoup: 'Soup of the day',
      rsvpStarterPasta: 'Fazzoletti stuffed with ricotta and spinach, rosé sauce',
      rsvpMain: 'Main course',
      rsvpMainChicken: 'Chicken supreme with drumettes, garlic mashed potatoes and grilled vegetables',
      rsvpMainFish: 'Miso-glazed black cod with wild rice and sautéed spinach',
      rsvpMainSteak: '16oz bone-in rib steak, garlic mashed potatoes and vegetables',
      rsvpMainVeg: 'Vegetarian: Cavatelli with truffle, wild mushrooms, black truffle oil, house tomato sauce, arugula',
      rsvpDessert: 'Dessert',
      rsvpDessertItem: 'White and dark chocolate mousse cake — with coffee or tea',
      rsvpMainKid: 'Kid\'s menu',
      rsvpYourMenu: 'Your menu',
      rsvpCompanionTitle: 'Guest',
      rsvpCompanionName: 'Full name',
      rsvpDietary: 'Allergies or dietary restrictions (optional)',
      rsvpMessage: 'Message for the couple (optional)',
      rsvpSubmit: 'Send my RSVP',
      rsvpSuccess: 'Thank you! Your RSVP has been received. We can\'t wait to celebrate with you.',
      rsvpError: 'Something went wrong. Please try again or contact us directly.',
      rsvpDeadline: 'Kindly respond by September 1st, 2026',
      detailsCeremony: 'Ceremony',
      detailsReception: 'Reception',
      timelineThe: 'THE',
      timelineWedding: 'WEDDING',
      timelineDay: 'DAY',
      timelineScript: 'Schedule',
      timelineTime1: '1:00 PM',
      timelineTime2: '1:30 PM',
      timelineTime3: '3:00 PM',
      timelineTime4: '4:00 PM',
      timelineTime5: '6:00 PM',
      timelineEvent1: 'Guest Arrival',
      timelineEvent2: 'Chapel Ceremony',
      timelineEvent3: 'Bridal Photo Session',
      timelineEvent4: 'Cocktail Hour',
      timelineEvent5: 'Dinner',
      timelineTime6: '9:00 PM',
      timelineEvent6: 'After dinner cocktail and party',
      dressCodeTitle: 'Dress Code',
      dressCodePara1: 'We\'d love to see our family and friends dressed up for our special day. To help you plan your outfit, we suggest cocktail/semi-formal attire.',
      dressCodePara2: 'We kindly ask guests to avoid wearing white or black attire. No jeans please!',
      parkingTitle: 'Parking',
      parkingPara: 'Nearby, there are several self-service parking lots available for guests. You can find parking options here:'
    },
    fr: {
      saveTheDate: 'Marquez la Date',
      details: 'Détails',
      timeline: 'Chronologie',
      rsvp: 'RSVP',
      weddingDate: '10 Octobre 2026',
      days: 'Jours',
      hours: 'Heures',
      minutes: 'Minutes',
      seconds: 'Secondes',
      saveTheDateSection: 'Marquez la Date',
      timelineSection: 'Chronologie',
      detailsSection: 'Détails du Mariage',
      rsvpSection: 'RSVP',
      rsvpSubtitle: 'Merci de répondre avant le 1er septembre 2026. Passé cette date, l\'absence de réponse sera considérée comme un refus.',
      addToCalendar: 'Ajouter à Votre Calendrier',
      googleCalendar: 'Google Agenda',
      outlookCalendar: 'Outlook',
      appleCalendar: 'Calendrier Apple',
      welcomeMessage: 'Vous êtes invités',
      welcomePara1: 'Nous sommes si heureux que vous soyez là et avons hâte de célébrer ce moment spécial avec vous.',
      welcomePara2: 'Cet espace a été soigneusement conçu pour vous guider à travers tous les détails à l\'approche de notre mariage — des informations sur le lieu et le RSVP au programme et autres essentiels.',
      welcomePara3: 'Avoir votre présence en ce jour signifie tout pour nous, et nous sommes vraiment impatients de partager ces moments, ces rires et ces souvenirs ensemble.',
      welcomeClosing: 'Avec tout notre amour,',
      welcomeNames: 'Kaige & Melina',
      rsvpName: 'Nom complet',
      rsvpAttending: 'Serez-vous présent(e) ?',
      rsvpAttendingYes: 'Accepte avec joie',
      rsvpAttendingNo: 'Décline à regret',
      rsvpGuests: 'Nombre d\'invités (vous inclus)',
      rsvpStarter: 'Entrée',
      rsvpStarterSoup: 'Soupe du jour',
      rsvpStarterPasta: 'Fazzoletti, farcis à la ricotta et aux épinards, sauce rosée',
      rsvpMain: 'Plat principal',
      rsvpMainChicken: 'Suprême de poulet avec manchons, purée de pommes de terre à l\'ail et légumes grillés',
      rsvpMainFish: 'Morue noire laquée au miso avec riz sauvage et sauté d\'épinards',
      rsvpMainSteak: 'Bifteck de côte sur os 16oz, purée de pommes de terre à l\'ail et légumes',
      rsvpMainVeg: 'Végétarien : Cavatellia la truffe, champignons sauvages, huile de truffe noire, sauce tomate maison, roquette',
      rsvpDessert: 'Dessert',
      rsvpDessertItem: 'Étagé de mousse de chocolat blanc et noir — avec café ou thé',
      rsvpMainKid: 'Menu enfant',
      rsvpYourMenu: 'Votre menu',
      rsvpCompanionTitle: 'Invité',
      rsvpCompanionName: 'Nom complet',
      rsvpDietary: 'Allergies ou restrictions alimentaires (optionnel)',
      rsvpMessage: 'Message pour les mariés (optionnel)',
      rsvpSubmit: 'Envoyer mon RSVP',
      rsvpSuccess: 'Merci ! Votre RSVP a bien été reçu. Nous avons hâte de fêter ça avec vous.',
      rsvpError: 'Une erreur s\'est produite. Veuillez réessayer ou nous contacter directement.',
      rsvpDeadline: 'Merci de répondre avant le 1er septembre 2026',
      detailsCeremony: 'Cérémonie',
      detailsReception: 'Réception',
      timelineThe: 'LE',
      timelineWedding: 'GRAND',
      timelineDay: 'JOUR',
      timelineScript: 'Programme',
      timelineTime1: '13h00',
      timelineTime2: '13h30',
      timelineTime3: '15h00',
      timelineTime4: '16h00',
      timelineTime5: '18h00',
      timelineEvent1: 'Arrivée des invités',
      timelineEvent2: 'Cérémonie à la chapelle',
      timelineEvent3: 'Séance photo des mariés',
      timelineEvent4: 'Cocktail',
      timelineEvent5: 'Souper',
      timelineTime6: '21h00',
      timelineEvent6: 'Cocktail après-souper et soirée',
      dressCodeTitle: 'Code vestimentaire',
      dressCodePara1: 'Nous adorerions voir notre famille et nos amis élégamment habillés pour notre grand jour. Pour vous aider à planifier votre tenue, nous suggérons une tenue cocktail ou semi-formelle.',
      dressCodePara2: 'Nous vous demandons gentiment d\'éviter les tenues blanches ou noires. Pas de jeans, s\'il vous plaît !',
      parkingTitle: 'Stationnement',
      parkingPara: 'À proximité, plusieurs stationnements en libre-service sont disponibles pour les invités. Vous pouvez trouver des options de stationnement ici :'
    },
    zh: {
      saveTheDate: '预留佳期',
      details: '详情',
      timeline: '日程',
      rsvp: '出席确认',
      weddingDate: '2026年10月10日',
      days: '天',
      hours: '小时',
      minutes: '分钟',
      seconds: '秒',
      saveTheDateSection: '敬请预留佳期',
      timelineSection: '日程',
      detailsSection: '婚礼详情',
      rsvpSection: '确认出席',
      rsvpSubtitle: '请于2026年9月1日前回复。逾期未回复将视为无法出席。',
      addToCalendar: '添加到日历',
      googleCalendar: '谷歌日历',
      outlookCalendar: 'Outlook',
      appleCalendar: '苹果日历',
      welcomeMessage: '敬邀',
      welcomePara1: '我们非常高兴邀请您来到这里，并迫不及待与您共庆这一幸福时刻。',
      welcomePara2: '我们精心设计了这个页面，为您提供婚礼临近时所需的场地信息，活动流程及其他须知。',
      welcomePara3: '与您共同陪伴的这一天，意义非凡。我们真心期待一同分享这些欢笑与爱的回忆。',
      welcomeClosing: '满怀爱意，',
      welcomeNames: 'Kaige & Melina',
      rsvpName: '姓名',
      rsvpAttending: '您是否出席？',
      rsvpAttendingYes: '欣然出席',
      rsvpAttendingNo: '遗憾婉拒',
      rsvpGuests: '随行人数（含本人）',
      rsvpStarter: '前菜',
      rsvpStarterSoup: '每日例汤',
      rsvpStarterPasta: '法佐莱蒂意式方饺（里科塔奶酪与菠菜馅，配番茄奶油酱汁）',
      rsvpMain: '主菜',
      rsvpMainChicken: '脆皮鸡胸，配蒜香土豆泥及烤时蔬',
      rsvpMainFish: '味噌烤黑鳕鱼，配野米和炒菠菜',
      rsvpMainSteak: '16盎司带骨肋眼牛排，配蒜香土豆泥和时蔬',
      rsvpMainVeg: '素食：黑松露油野蘑菇卡瓦泰利意面，配招牌番茄酱，芝麻菜',
      rsvpDessert: '甜点',
      rsvpDessertItem: '黑白双搭巧克力慕斯蛋糕，配咖啡或茶',
      rsvpMainKid: '儿童套餐',
      rsvpYourMenu: '您的选择',
      rsvpCompanionTitle: '同行宾客',
      rsvpCompanionName: '姓名',
      rsvpDietary: '过敏或饮食忌口（可选）',
      rsvpMessage: '给新人的留言（选填）',
      rsvpSubmit: '提交我的出席确认',
      rsvpSuccess: '谢谢！已收到您的出席确认。我们迫不及待与您想见。',
      rsvpError: '出现了一些问题，请重试或直接联系我们。',
      rsvpDeadline: '请在2026年9月1日前回复',
      detailsCeremony: '仪式场地',
      detailsReception: '婚宴场地',
      timelineThe: '',
      timelineWedding: '婚礼日',
      timelineDay: '',

      timelineScript: '日程',
      timelineTime1: '下午1:00',
      timelineTime2: '下午1:30',
      timelineTime3: '下午3:00',
      timelineTime4: '下午4:00',
      timelineTime5: '下午6:00',
      timelineEvent1: '宾客入场',
      timelineEvent2: '教堂仪式',
      timelineEvent3: '新人拍照环节',
      timelineEvent4: '鸡尾酒会',
      timelineEvent5: '晚宴',
      timelineTime6: '晚上9:00',
      timelineEvent6: '餐后鸡尾酒会与派对',
      dressCodeTitle: '着装要求',
      dressCodePara1: '我们期待在特别的日子里看到亲友们盛装出席。建议您选择鸡尾酒会礼服，半正式或商务着装。',
      dressCodePara2: '请避免穿着与新人撞色的白色或黑色服装，也请勿穿牛仔裤。',
      parkingTitle: '停车指引',
      parkingPara: '附近有多个自助停车场可供使用。您可在此查看停车选项：'
    }
  };

  private countdownInterval: any;

  constructor(private cdr: ChangeDetectorRef, public languageService: LanguageService, private firestore: Firestore, private injector: Injector) {}

  ngOnInit(): void {
    this.updateCountdown();
    this.countdownInterval = setInterval(() => {
      this.updateCountdown();
      this.cdr.markForCheck();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  onGuestCountChange(): void {
    const count = Math.max(1, Math.min(10, this.rsvpForm.totalGuests || 1));
    this.rsvpForm.totalGuests = count;
    const needed = count - 1;
    while (this.rsvpForm.companions.length < needed) {
      this.rsvpForm.companions.push({ name: '', starter: '', mainCourse: '' });
    }
    this.rsvpForm.companions.splice(needed);
  }

  async submitRsvp(): Promise<void> {
    if (!this.rsvpForm.name || !this.rsvpForm.attending) return;
    this.rsvpSubmitting = true;
    this.rsvpErrored = false;
    try {
      const attendees: GuestInfo[] = this.rsvpForm.attending === 'yes' ? [
        {
          name: this.rsvpForm.name,
          starter: this.rsvpForm.myMainCourse === 'kid' ? 'kid' : this.rsvpForm.myStarter,
          mainCourse: this.rsvpForm.myMainCourse
        },
        ...this.rsvpForm.companions.map(c => ({
          name: c.name,
          starter: c.mainCourse === 'kid' ? 'kid' : c.starter,
          mainCourse: c.mainCourse
        }))
      ] : [];
      await runInInjectionContext(this.injector, () =>
        addDoc(collection(this.firestore, 'rsvps'), {
          submitterName: this.rsvpForm.name,
          attending: this.rsvpForm.attending,
          totalGuests: this.rsvpForm.attending === 'yes' ? this.rsvpForm.totalGuests : 0,
          attendees,
          dietary: this.rsvpForm.dietary,
          message: this.rsvpForm.message,
          submittedAt: new Date().toISOString(),
          language: this.languageService.language
        })
      );
      this.rsvpSubmitted = true;
    } catch (err) {
      console.error('Firestore write failed:', err);
      this.rsvpErrored = true;
    } finally {
      this.rsvpSubmitting = false;
    }
  }

  addToGoogleCalendar(): void {
    const event = encodeURIComponent('Kaige & Melina\'s Wedding');
    const details = encodeURIComponent('Celebrating the wedding of Kaige and Melina');
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${event}&details=${details}&dates=20261010/20261011`;
    window.open(url, '_blank');
  }

  addToOutlook(): void {
    const event = encodeURIComponent('Kaige & Melina\'s Wedding');
    const details = encodeURIComponent('Celebrating the wedding of Kaige and Melina');
    const url = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${event}&body=${details}&startdt=2026-10-10&enddt=2026-10-11`;
    window.open(url, '_blank');
  }

  addToAppleCalendar(): void {
    const event = encodeURIComponent('Kaige & Melina\'s Wedding');
    const details = encodeURIComponent('Celebrating the wedding of Kaige and Melina');
    const url = `data:text/calendar,BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//My Event//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
DTSTART:20261010
DTEND:20261011
SUMMARY:Kaige & Melina's Wedding
DESCRIPTION:Celebrating the wedding of Kaige and Melina
UID:1@example.com
END:VEVENT
END:VCALENDAR`;
    const link = document.createElement('a');
    link.href = url;
    link.download = 'kaige-melina-wedding.ics';
    link.click();
  }

  get t(): Translations {
    return this.translations[this.languageService.language];
  }

  private updateCountdown(): void {
    const weddingDate = new Date('2026-10-10T00:00:00').getTime();
    const now = new Date().getTime();
    const difference = weddingDate - now;

    if (difference > 0) {
      this.countdown.days = Math.floor(difference / (1000 * 60 * 60 * 24));
      this.countdown.hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
      this.countdown.minutes = Math.floor((difference / 1000 / 60) % 60);
      this.countdown.seconds = Math.floor((difference / 1000) % 60);
    } else {
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }
  }
}
