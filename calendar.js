// ============================================================
// OKULLARIN BİTMESİNE KAÇ GÜN KALDI?
// SCHOOL CALENDAR DATA
// ============================================================

const SCHOOL_CALENDARS = [

    {
        year: "2026-2027",

        start: new Date(2026, 8, 14),
        end: new Date(2027, 5, 25),

        breaks: [

            {
                name: "Birinci Ara Tatil",
                start: new Date(2026, 10, 16),
                end: new Date(2026, 10, 20)
            },

            {
                name: "Yarıyıl Tatili",
                start: new Date(2027, 0, 25),
                end: new Date(2027, 1, 5)
            },

            {
                name: "İkinci Ara Tatil",
                start: new Date(2027, 2, 8),
                end: new Date(2027, 2, 12)
            }

        ],

        holidays: [

            {
                name: "Cumhuriyet Bayramı",
                start: new Date(2026, 9, 29),
                end: new Date(2026, 9, 29)
            },

            {
                name: "Yılbaşı",
                start: new Date(2027, 0, 1),
                end: new Date(2027, 0, 1)
            },

            {
                name: "Ramazan Bayramı",
                start: new Date(2027, 2, 9),
                end: new Date(2027, 2, 11)
            },

            {
                name: "Ulusal Egemenlik ve Çocuk Bayramı",
                start: new Date(2027, 3, 23),
                end: new Date(2027, 3, 23)
            },

            {
                name: "Kurban Bayramı",
                start: new Date(2027, 4, 16),
                end: new Date(2027, 4, 19)
            }

        ],

        halfDays: [

            new Date(2026, 9, 28),
            new Date(2027, 2, 8),
            new Date(2027, 4, 15)

        ]

    }

];


// ============================================================
// FIND THE CALENDAR THAT CONTAINS TODAY
// ============================================================

function getCalendarForDate(date) {

    return SCHOOL_CALENDARS.find(
        calendar =>
            date >= calendar.start &&
            date <= calendar.end
    ) || null;

}