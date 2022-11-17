import styles from './styles.module.css';

export const Snipping = ({bg_color}) => {
  return (
    <div className={`${styles.bg_snipping} z-100 fixed h-full w-full left-0 top-0`} style={{backgroundColor:bg_color}}>
      <div className={`${styles.sk_chase}`}>
        <div className={`${styles.sk_chase_dot}`}></div>
        <div className={`${styles.sk_chase_dot}`}></div>
        <div className={`${styles.sk_chase_dot}`}></div>
        <div className={`${styles.sk_chase_dot}`}></div>
        <div className={`${styles.sk_chase_dot}`}></div>
        <div className={`${styles.sk_chase_dot}`}></div>
      </div>
    </div>
  )
}