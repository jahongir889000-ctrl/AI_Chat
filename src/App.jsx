import { ChatWidget } from './components/ChatWidget/ChatWidget.jsx';
import styles from './App.module.css';

export default function App() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.badge}>ИИ-чат</p>
        <h1 className={styles.title}>Разговор, который не ждёт очереди</h1>
        <p className={styles.subtitle}>
          Консультант по медицинским товарам подскажет по каталогу и заказу. Вопросы о приёме
          врачей и услугах клиники — по телефону медцентра. Нажмите кнопку с оператором в углу.
        </p>
      </header>
      <main className={styles.content}>
        <section className={styles.card}>
          <h2>Зачем это здесь</h2>
          <p className={styles.cardText}>
            Ассистент отвечает на вопросы о медтехнике, расходниках и уходовых изделиях.
            Не заменяет врача и не консультирует по лечению — для этого предусмотрен звонок
            в медцентр прямо в ответе бота.
          </p>
        </section>
      </main>
      <ChatWidget />
    </div>
  );
}
