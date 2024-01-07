import React from 'react';
import '../../index.css'
import styles from './home.module.css'

const Home = () => {
  return (
    <div className='content'>
      <h3 className='headers'>Welcome to the SAM Chairs Platform</h3>
      <div className={styles.rules}>
        <h3 className='headers'>Don't be a dick and follow these rules</h3>
        <ul className={styles.list}>
          <li className='paragraph'>Chairs: use only the tab that is assigned to your role</li>
          <li className='paragraph'>The live budget tracker has its own tab, and can be used to see the visual of how much each chair spent</li>
          <li className='paragraph'>KevBen</li>
        </ul>
      </div>
      <div className={styles.rolesList}>
        <h4 className='headers'>Currently, these following positions are supported: </h4>
        <ul className={styles.list}>
          <li className='paragraph'>Exchequer</li>
          <li className='paragraph'>Academic</li>
        </ul>
      </div>
      <div className={styles.faq}>
        <h2>Please direct questions to:</h2>
      </div>
    </div>
  );
}

export default Home;