/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const PILLARS = [
  {
    id: 'transportation',
    title: 'TRANSPORTATION',
    description: 'Navigo, Metro, Transfers, Access to Airports',
    icon: 'TrainFront',
  },
  {
    id: 'tourist-guide',
    title: 'TOURIST GUIDE',
    description: 'Gastronomy, Landmarks, Tax-Free, and Emergency',
    icon: 'Compass',
  },
  {
    id: 'about-hotel',
    title: 'ABOUT HOTEL',
    description: 'History & Heritage, Services, Rooms',
    icon: 'Hotel',
  },
  {
    id: 'essential-french',
    title: 'ESSENTIAL FRENCH',
    description: 'Etiquette, Phrases, and Pronunciation',
    icon: 'Languages',
  },
];

export const PLACEHOLDER_MESSAGE = (categoryName: string) => 
  `*Our curated guide for ${categoryName} is currently being handcrafted to ensure it meets the Hotel Langlois standard of excellence. Please consult the AI Concierge for general assistance in the meantime.*`;

export const KNOWLEDGE_BASE = {
  hotel: {
    name: "Hôtel Langlois",
    address: "7 rue Saint-Lazare, 75009 Paris",
    style: "Art Nouveau",
    heritage: "Since 1870",
  },
  transportation: {
    stations: [
      { name: "Saint-Lazare Station", walk: "3-min", connections: "Metro Lines 3, 12, 13, and 14" },
      { name: "Haussmann – Saint-Lazare", walk: "5-min", connections: "RER E, Gare du Nord" },
      { name: "Auber", walk: "8-min", connections: "RER A, Disneyland Paris" },
    ],
    fares: {
      single_metro: "€2.25",
      single_bus: "€2.05",
      navigo_easy: "€2.00",
      navigo_jour: "€12.30",
      paris_visite: ["€30.60 (1 day)", "€45.40 (2 days)", "€63.80 (3 days)", "€78.00 (5 days)"]
    },
    buying_instructions: "Digital/Contactless: Île-de-France Mobilités App on smartphone or Apple Wallet for iPhone users. Station Kiosks: Multilingual ticket machines available at Saint-Lazare, Auber, and Haussmann (accept international credit cards).",
    airport_transfers: {
      price: "14€ per trip (all zones)",
      routes: [
        { airport: "Orly Airport", via: "Metro 14 or Orlyval" },
        { airport: "CDG Airport", via: "RER B train" }
      ],
      how_to_buy: "Recharge on Navigo Easy pass or directly on smartphone",
      note: "Paris Visite (Zones 1-5) includes airport transfers at no extra cost"
    }
  }
};

export const PILLAR_CONTENT: Record<string, string> = {
  'ABOUT HOTEL': `
&nbsp;

#### 🏛️ WELCOME TO HOTEL LANGLOIS

*Originally built as a bank in 1870, this historic building was transformed into a hotel in 1896 under the name L'Hôtel Meublé des Croisés.*

*Since then, Hôtel Langlois has stood as a landmark of Parisian elegance. We invite you to explore the legacy and services of our historic residence.*

&nbsp;
***
&nbsp;

**[HISTORY_HERITAGE]: 📜 History & Heritage**  
*Our journey since 1870, etched in stone and glass.*

&nbsp;

**[BESPOKE_SERVICES]: ✨ Bespoke Services**  
*Guest amenities and the hallmark Langlois experience.*

&nbsp;

**[THE_ROOMS]: 🛌 The Rooms**  
*Authentic 19th-century Parisian living, uniquely designed.*

&nbsp;
`,
  'HISTORY_HERITAGE': `
&nbsp;

#### 📜 HISTORY & HERITAGE

*Step back into the foundations of our residence, where the legacy of 1870 meets the golden era of French cinema.*

&nbsp;

*   **The Architectural Evolution**  
    The imposing cut-stone building that houses our hotel was originally constructed in the late 19th century to function as a bank. By 1896, the structure was repurposed into a private hotel known as **L’Hôtel Meublé des Croisés**, marking the start of its long history in Parisian hospitality.

&nbsp;

*   **Reaching New Heights**  
    Originally only two stories high, the building underwent significant expansions in 1896 and 1905. These additions completed our elegant **six-story structure**, carefully preserving the classic architectural details that define our landmark today.

&nbsp;
***
&nbsp;

#### 🎬 CINEMATIC LEGACY

*Our authentic Belle Époque charm has made the hotel a natural sanctuary for the arts.*

&nbsp;

*   **A Backdrop for the Arts**  
    Over the years, our preserved atmosphere has attracted film directors, photographers, and fashion houses seeking a genuine piece of old Paris.

&nbsp;

*   **The Henri Langlois Tribute**  
    While filming **The Truth About Charlie**, director Jonathan Demme chose to honor **Henri Langlois**, the iconic founder of the Cinémathèque Française, by naming the hotel after him in the movie. We embraced this meaningful tribute to French cinema and made it our permanent name.

&nbsp;
`,
  'BESPOKE_SERVICES': `
#### ✨ BESPOKE SERVICES
***
*At Hotel Langlois, we believe that true luxury lies in the personalization of every guest's stay. From our historic elevator to our attentive concierge service, every detail is designed to ensure a seamless Parisian experience.*

*   The curated details for this section of Hotel Langlois are currently being prepared to reflect our 1870 heritage perfectly.
*   Please consult the AI Concierge for immediate general inquiries.

&nbsp;
`,
  'THE_ROOMS': `
#### 🛌 THE ROOMS
***
*Discover guest rooms where 19th-century authenticity meets modern comfort, each uniquely shaped by our heritage layout. From original fireplaces to soaring ceilings, every room offers a unique vantage point over the streets of Paris.*

*   The curated details for this section of Hotel Langlois are currently being prepared to reflect our 1870 heritage perfectly.
*   Please consult the AI Concierge for immediate general inquiries.

&nbsp;
`,
  'TRANSPORTATION': `
&nbsp;

#### 🚉 TRANSPORTATION GUIDE

*Navigate Paris like a local. Choose a category below to explore stations, fares, and transfer details:*

&nbsp;

**[NEARBY_STATIONS]: Nearby Stations**
**[FARES_TICKETS]: Fares & Tickets**
**[HOW_TO_BUY_TICKETS]: How to Buy Tickets**
**[AIRPORT_TRANSFERS]: Airport Transfers**

&nbsp;
`,
  'NEARBY_STATIONS': `
&nbsp;

#### 🚉 NEARBY STATIONS

*Hotel Langlois is positioned at the center of Paris’s mobility:*

&nbsp;

*   **Saint-Lazare Station (3-min walk)**  
    Our primary hub. Access to **Metro Lines 3, 12, 13, and 14**.

&nbsp;

*   **Haussmann – Saint-Lazare (5-min walk)**  
    Direct access to **RER E**, connecting to Gare du Nord.

&nbsp;

*   **Auber (8-min walk)**  
    Access to **RER A**, for direct transit to **Disneyland Paris**.

&nbsp;

`,
  'FARES_TICKETS': `
&nbsp;

#### 🎫 FARES & TICKETS

&nbsp;

*   **Navigo Easy Card**  
    Costs **€2.00**. A physical card you can load with tickets or day passes.

&nbsp;

*   **Single Metro Ticket (Ticket t+)**  
    **€2.25** for Metro and RER (within Paris); **€2.05** for Bus and Tram.

&nbsp;

*   **Navigo Jour (Zones 1-5)**  
    Costs **€12.30**. Unlimited travel for one day across all zones.
    *   Excludes direct airport transfers.

&nbsp;

*   **Paris Visite**  
    A pass designed for tourists. Unlimited travel for 1, 2, 3, or 5 consecutive days  
    **(30.60€, 45.40€, 63.80€, and 78.00€ respectively)**.
    *   Includes airport transfers.

&nbsp;

`,
  'HOW_TO_BUY_TICKETS': `
&nbsp;

#### 📱 HOW TO BUY TICKETS

&nbsp;

*   **Île-de-France Mobilités App**  
    Purchase tickets directly via the app on your smartphone.

&nbsp;

*   **Apple Wallet**  
    iPhone users can add a travel card directly to their Apple Wallet for a "tap-and-go" experience.

&nbsp;

*   **Station Kiosks**  
    All nearby stations feature multilingual ticket machines that accept international credit cards.

&nbsp;

`,
  'AIRPORT_TRANSFERS': `
&nbsp;

#### ✈️ AIRPORT TRANSFERS

&nbsp;

**Price**: **14€** per trip (all zones).

&nbsp;

**Routes Included**:
*   **Orly Airport**: Via **Metro 14** or **Orlyval**.
*   **CDG Airport**: Via the **RER B** train.

&nbsp;

**How to Buy**: 
Can be recharged on your **Navigo Easy** pass or directly on your **smartphone**.

&nbsp;

If you have already purchased a **Paris Visite (Zones 1-5)**, airport transfers are already included at **no extra cost**.

&nbsp;

`,
};
