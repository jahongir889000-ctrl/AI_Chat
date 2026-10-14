import { ChatWidget } from './components/ChatWidget/ChatWidget.jsx';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.badge}>ИИ-чат</p>
        <h1 className={styles.title}>Разговор, который не ждёт очереди</h1>
        <p className={styles.subtitle}>
          Умный ассистент на связи день и ночь: отвечает по делу, помнит контекст диалога
          и не устаёт от «а можно ещё раз?». Нажмите на круг с оператором в углу — и начните
          с любого вопроса.
        </p>
      </header>
      <main className={styles.content}>
        <section className={styles.card}>
          <h2>Зачем это здесь</h2>
          <p className={styles.cardText}>
            Это живая витрина виджета: его можно встроить на сайт, в личный кабинет или
            страницу поддержки. Ассистент подстраивается под ваши сценарии — от FAQ до
            записи на демо — а интерфейс остаётся лёгким и привычным для пользователя.
          </p>
        </section>
      </main>
      <ChatWidget />
    </div>
  );
}
