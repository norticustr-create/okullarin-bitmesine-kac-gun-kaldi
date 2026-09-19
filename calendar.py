from datetime import date, timedelta


# ============================================================
# OKULLARIN BİTMESİNE KAÇ GÜN KALDI?
# School Days Money Machine™
#
# Turkey — MEB 2026–2027
# ============================================================


# ------------------------------------------------------------
# SCHOOL YEAR
# ------------------------------------------------------------

SCHOOL_YEAR_START = date(2026, 9, 14)
SCHOOL_YEAR_END = date(2027, 6, 25)


# ------------------------------------------------------------
# MEB SCHOOL BREAKS
# ------------------------------------------------------------

SCHOOL_BREAKS = [
    {
        "name": "Birinci Ara Tatil",
        "start": date(2026, 11, 16),
        "end": date(2026, 11, 20),
    },
    {
        "name": "Yarıyıl Tatili",
        "start": date(2027, 1, 25),
        "end": date(2027, 2, 5),
    },
    {
        "name": "İkinci Ara Tatil",
        "start": date(2027, 3, 8),
        "end": date(2027, 3, 12),
    },
]


# ------------------------------------------------------------
# OFFICIAL HOLIDAYS
#
# Full holidays remove the day from the school-day count.
# ------------------------------------------------------------

FULL_HOLIDAYS = [
    {
        "name": "Cumhuriyet Bayramı",
        "start": date(2026, 10, 29),
        "end": date(2026, 10, 29),
    },
    {
        "name": "Yılbaşı",
        "start": date(2027, 1, 1),
        "end": date(2027, 1, 1),
    },
    {
        "name": "Ramazan Bayramı",
        "start": date(2027, 3, 9),
        "end": date(2027, 3, 11),
    },
    {
        "name": "Ulusal Egemenlik ve Çocuk Bayramı",
        "start": date(2027, 4, 23),
        "end": date(2027, 4, 23),
    },
    {
        "name": "Kurban Bayramı",
        "start": date(2027, 5, 16),
        "end": date(2027, 5, 19),
    },
]


# ------------------------------------------------------------
# HALF DAYS
#
# IMPORTANT:
# Half-days COUNT as school days for our product.
#
# We keep them here for transparency/documentation,
# but they do NOT reduce the school-day count.
# ------------------------------------------------------------

HALF_DAYS = [
    {
        "name": "Cumhuriyet Bayramı Arifesi",
        "date": date(2026, 10, 28),
    },
    {
        "name": "Ramazan Bayramı Arifesi",
        "date": date(2027, 3, 8),
    },
    {
        "name": "Kurban Bayramı Arifesi",
        "date": date(2027, 5, 15),
    },
]


# ------------------------------------------------------------
# HELPER FUNCTIONS
# ------------------------------------------------------------

def date_in_range(day, start, end):
    return start <= day <= end


def get_school_break(day):
    """Return the MEB break containing this date, if any."""

    for holiday in SCHOOL_BREAKS:
        if date_in_range(day, holiday["start"], holiday["end"]):
            return holiday

    return None


def get_full_holiday(day):
    """Return the full public holiday containing this date, if any."""

    for holiday in FULL_HOLIDAYS:
        if date_in_range(day, holiday["start"], holiday["end"]):
            return holiday

    return None


def is_half_day(day):
    """Return True if the date is officially a half-day."""

    return any(item["date"] == day for item in HALF_DAYS)


def is_school_day(day):
    """
    Determine whether a date counts as a school day.

    Our product rule:
    - Weekends = no
    - Outside MEB school year = no
    - MEB school breaks = no
    - Full public holidays = no
    - Half-days = YES
    """

    # Outside school year
    if day < SCHOOL_YEAR_START or day > SCHOOL_YEAR_END:
        return False

    # Saturday / Sunday
    if day.weekday() >= 5:
        return False

    # MEB school breaks
    if get_school_break(day):
        return False

    # Full public holidays
    if get_full_holiday(day):
        return False

    # Otherwise it is a school day.
    # Half-days deliberately count.
    return True


def count_school_days(start_date, end_date):
    """Count school days between two dates, inclusive."""

    count = 0
    current = start_date

    while current <= end_date:

        if is_school_day(current):
            count += 1

        current += timedelta(days=1)

    return count


def school_days_remaining(today):
    """
    Count school days AFTER today.

    If today is Sunday, for example, we start counting Monday.
    """

    tomorrow = today + timedelta(days=1)

    if tomorrow > SCHOOL_YEAR_END:
        return 0

    return count_school_days(tomorrow, SCHOOL_YEAR_END)


# ------------------------------------------------------------
# AUDIT
# ------------------------------------------------------------

def audit_school_days(start_date, end_date):

    total_weekdays = 0
    break_days = 0
    holiday_days = 0
    school_days = 0

    current = start_date

    while current <= end_date:

        # Ignore weekends
        if current.weekday() < 5:

            total_weekdays += 1

            if get_school_break(current):
                break_days += 1

            elif get_full_holiday(current):
                holiday_days += 1

            else:
                school_days += 1

        current += timedelta(days=1)

    return {
        "weekdays": total_weekdays,
        "school_break_days": break_days,
        "full_holiday_days": holiday_days,
        "school_days": school_days,
    }


# ------------------------------------------------------------
# TEST / DEMO
# ------------------------------------------------------------

if __name__ == "__main__":

    today = date.today()

    print("=" * 65)
    print("OKULLARIN BİTMESİNE KAÇ GÜN KALDI?")
    print("School Days Money Machine™")
    print("=" * 65)

    print()
    print(f"Bugün: {today}")
    print(
        f"Eğitim yılı: "
        f"{SCHOOL_YEAR_START} → {SCHOOL_YEAR_END}"
    )

    remaining = school_days_remaining(today)

    print()
    print(f"Bugünden sonra kalan okul günü: {remaining}")

    # --------------------------------------------------------
    # AUDIT
    # --------------------------------------------------------

    tomorrow = today + timedelta(days=1)

    if tomorrow <= SCHOOL_YEAR_END:

        audit = audit_school_days(
            tomorrow,
            SCHOOL_YEAR_END
        )

        print()
        print("HESAPLAMA DÖKÜMÜ")
        print("-" * 65)

        print(
            f"Hafta içi günleri:        "
            f"{audit['weekdays']}"
        )

        print(
            f"MEB tatilleri:            "
            f"-{audit['school_break_days']}"
        )

        print(
            f"Resmi tatiller:           "
            f"-{audit['full_holiday_days']}"
        )

        print("-" * 65)

        print(
            f"TOPLAM OKUL GÜNÜ:         "
            f"{audit['school_days']}"
        )

    # --------------------------------------------------------
    # TEST DATES
    # --------------------------------------------------------

    print()
    print("TEST TARİHLERİ")
    print("-" * 65)

    test_dates = [
        date(2026, 9, 14),
        date(2026, 10, 28),
        date(2026, 10, 29),
        date(2026, 11, 16),
        date(2027, 1, 1),
        date(2027, 1, 25),
        date(2027, 3, 8),
        date(2027, 3, 9),
        date(2027, 4, 23),
        date(2027, 5, 17),
        date(2027, 5, 19),
        date(2027, 6, 25),
    ]

    for day in test_dates:

        if is_school_day(day):

            if is_half_day(day):
                status = "OKUL GÜNÜ (YARIM GÜN)"
            else:
                status = "OKUL GÜNÜ"

        else:

            break_info = get_school_break(day)
            holiday_info = get_full_holiday(day)

            if break_info:
                status = f"TATİL — {break_info['name']}"

            elif holiday_info:
                status = f"RESMİ TATİL — {holiday_info['name']}"

            else:
                status = "OKUL YOK"

        print(f"{day} → {status}")

    print()
    print("=" * 65)