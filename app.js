// ============================================================
// OKULLARIN BİTMESİNE KAÇ GÜN KALDI?
// CALCULATION ENGINE
// ============================================================


// ------------------------------------------------------------
// DATE HELPERS
// ------------------------------------------------------------

function dateOnly(date) {

    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );

}


function datesEqual(a, b) {

    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );

}


function dateInRange(day, start, end) {

    return day >= start && day <= end;

}


// ------------------------------------------------------------
// CURRENT CALENDAR
// ------------------------------------------------------------

const TODAY = dateOnly(new Date());

const CURRENT_CALENDAR =
    getCalendarForDate(TODAY);


// ------------------------------------------------------------
// SCHOOL DAY LOGIC
// ------------------------------------------------------------

function getSchoolBreak(day) {

    return CURRENT_CALENDAR.breaks.find(
        period =>
            dateInRange(
                day,
                period.start,
                period.end
            )
    );

}


function getFullHoliday(day) {

    return CURRENT_CALENDAR.holidays.find(
        period =>
            dateInRange(
                day,
                period.start,
                period.end
            )
    );

}


function isHalfDay(day) {

    return CURRENT_CALENDAR.halfDays.some(
        halfDay =>
            datesEqual(day, halfDay)
    );

}


function isSchoolDay(day) {

    // Outside current school year
    if (
        day < CURRENT_CALENDAR.start ||
        day > CURRENT_CALENDAR.end
    ) {

        return false;

    }


    // Saturday / Sunday
    const weekday = day.getDay();

    if (
        weekday === 0 ||
        weekday === 6
    ) {

        return false;

    }


    // MEB school breaks
    if (getSchoolBreak(day)) {

        return false;

    }


    // Full public holidays
    if (getFullHoliday(day)) {

        return false;

    }


    // Half-days count as school days.
    return true;

}


// ------------------------------------------------------------
// COUNT SCHOOL DAYS
// ------------------------------------------------------------

function countSchoolDays(startDate, endDate) {

    let count = 0;

    let current = new Date(startDate);


    while (current <= endDate) {

        if (isSchoolDay(current)) {

            count++;

        }

        current.setDate(
            current.getDate() + 1
        );

    }


    return count;

}


// ------------------------------------------------------------
// REMAINING SCHOOL DAYS
// ------------------------------------------------------------

function schoolDaysRemaining(today) {

    const tomorrow = new Date(today);

    tomorrow.setDate(
        tomorrow.getDate() + 1
    );


    if (
        tomorrow > CURRENT_CALENDAR.end
    ) {

        return 0;

    }


    return countSchoolDays(
        tomorrow,
        CURRENT_CALENDAR.end
    );

}


// ------------------------------------------------------------
// COMPLETED SCHOOL DAYS
// ------------------------------------------------------------

function calculateSchoolDaysCompleted(today) {

    if (
        today < CURRENT_CALENDAR.start
    ) {

        return 0;

    }


    const end =
        today > CURRENT_CALENDAR.end
            ? CURRENT_CALENDAR.end
            : today;


    return countSchoolDays(
        CURRENT_CALENDAR.start,
        end
    );

}


// ------------------------------------------------------------
// CALENDAR DAYS UNTIL SUMMER
// ------------------------------------------------------------

function calculateCalendarDaysLeft(today) {

    if (
        today >= CURRENT_CALENDAR.end
    ) {

        return 0;

    }


    const millisecondsPerDay =
        1000 * 60 * 60 * 24;


    return Math.ceil(
        (
            CURRENT_CALENDAR.end - today
        ) / millisecondsPerDay
    );

}


// ------------------------------------------------------------
// NEXT MEB BREAK
// ------------------------------------------------------------

function getNextBreak(today) {

    for (
        const breakPeriod
        of CURRENT_CALENDAR.breaks
    ) {

        if (
            breakPeriod.end >= today
        ) {

            return breakPeriod;

        }

    }


    return null;

}


// ------------------------------------------------------------
// DAYS UNTIL DATE
// ------------------------------------------------------------

function daysUntil(date, today) {

    const millisecondsPerDay =
        1000 * 60 * 60 * 24;


    return Math.max(
        0,
        Math.ceil(
            (date - today) /
            millisecondsPerDay
        )
    );

}


// ============================================================
// MAIN CALCULATION
// ============================================================

function calculate() {

    // No calendar available
    if (!CURRENT_CALENDAR) {

        document.getElementById(
            "school-days"
        ).textContent = "—";

        return;

    }


    const remaining =
        schoolDaysRemaining(TODAY);


    const completed =
        calculateSchoolDaysCompleted(
            TODAY
        );


    const calendarDaysLeft =
        calculateCalendarDaysLeft(
            TODAY
        );


    const totalSchoolDays =
        countSchoolDays(
            CURRENT_CALENDAR.start,
            CURRENT_CALENDAR.end
        );


    const progress =
        Math.min(
            100,
            Math.max(
                0,
                (
                    completed /
                    totalSchoolDays
                ) * 100
            )
        );


    // Main countdown

    document.getElementById(
        "school-days"
    ).textContent =
        remaining;


    // Completed days

    document.getElementById(
        "days-completed"
    ).textContent =
        completed;


    // Calendar days until summer

    document.getElementById(
        "calendar-days-left"
    ).textContent =
        calendarDaysLeft;


    // Progress

    document.getElementById(
        "progress-percent"
    ).textContent =
        `${progress.toFixed(1)}%`;


    document.getElementById(
        "progress-fill"
    ).style.width =
        `${progress}%`;


    // Next break

    const nextBreak =
        getNextBreak(TODAY);


    if (nextBreak) {

        const breakDays =
            daysUntil(
                nextBreak.start,
                TODAY
            );


        document.getElementById(
            "next-break-days"
        ).textContent =
            breakDays;


        document.getElementById(
            "next-break-name"
        ).textContent =
            `gün sonra ${nextBreak.name}`;

    }


    // Share

    document.getElementById(
        "share-button"
    ).addEventListener(
        "click",
        shareResult
    );

}


// ============================================================
// SHARE
// ============================================================

function shareResult() {

    const remaining =
        document.getElementById(
            "school-days"
        ).textContent;


    const text =
        `Okulların bitmesine ${remaining} okul günü kaldı! 🎒`;


    if (navigator.share) {

        navigator.share({

            title:
                "Okulların Bitmesine Kaç Gün Kaldı?",

            text: text,

            url:
                window.location.href

        });

    }

    else {

        navigator.clipboard.writeText(
            `${text}\n${window.location.href}`
        );


        const button =
            document.getElementById(
                "share-button"
            );


        const original =
            button.textContent;


        button.textContent =
            "✓ Kopyalandı!";


        setTimeout(
            () => {

                button.textContent =
                    original;

            },
            2000
        );

    }

}


// ============================================================
// START
// ============================================================

calculate();