import sqlite3
from telegram import Update
from telegram.ext import Updater, CommandHandler, CallbackContext, filters, MessageHandler, ApplicationBuilder, ContextTypes

# Настройки базы данных
DB_PATH = 'dev.db'

#def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    #await context.bot.send_message(chat_id=update.effective_chat.id, text="Привет! Я укажу конкретное издание книги по запросу)")

async def start(update: Update, context: CallbackContext) -> None:
    print(1)
    await update.message.reply_text("Привет! Я бот, который может помочь с маршрутами и местами. Попробуйте ввести один из запросов.")

async def get_all_routes(update: Update, context: CallbackContext) -> None:
    print(2)
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    await cursor.execute("SELECT * FROM Route")  # Предполагается, что у вас есть таблица Route
    routes = cursor.fetchall()
    conn.close()

    if not routes:
        await update.message.reply_text("Нет доступных маршрутов.")
    else:
        response = '\n'.join([str(route) for route in routes])  # Преобразуем маршруты в строку
        await update.message.reply_text(response)

async def get_all_places(update: Update, context: CallbackContext) -> None:
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Place")  # Предполагается, что у вас есть таблица Place
    places = cursor.fetchall()
    conn.close()

    if not places:
        update.message.reply_text("Нет доступных мест.")
    else:
        response = '\n'.join([str(place) for place in places])  # Преобразуем места в строку
        update.message.reply_text(response)

async def how_to_use(update: Update, context: CallbackContext) -> None:
    await update.message.reply_text("ответ3")

async def how_user_routes_work(update: Update, context: CallbackContext) -> None:
    await update.message.reply_text("ответ4")

async def how_to_add_place(update: Update, context: CallbackContext) -> None:
    await update.message.reply_text("ответ5")

async def how_to_add_route(update: Update, context: CallbackContext) -> None:
    await update.message.reply_text("ответ6")

async def question_7(update: Update, context: CallbackContext) -> None:
    await update.message.reply_text("ответ7")

def main() -> None:
    application = ApplicationBuilder().token('7691352797:AAGnkrVqLhOijJNxhqblQvJyIvEd-m1Ztgw').build()

    
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("all_routes", get_all_routes))
    application.add_handler(CommandHandler("all_places", get_all_places))
    application.add_handler(CommandHandler("how_to_use", how_to_use))
    application.add_handler(CommandHandler("how_user_routes_work", how_user_routes_work))
    application.add_handler(CommandHandler("how_to_add_place", how_to_add_place))
    application.add_handler(CommandHandler("how_to_add_route", how_to_add_route))
    application.add_handler(CommandHandler("q7", question_7))

    # Запуск бота
    #updater.start_polling()
    #updater.idle()
    application.run_polling()


if __name__ == '__main__':
    main()
