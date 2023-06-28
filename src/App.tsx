import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import './App.css';
import { inferFromImageFiles } from './roboflowApi'

export interface ItemCounts {
  Shirt: number;
  Sock: number;
  Underwear: number;
  Shorts: number;
}

const useApiKey = (): string => new URLSearchParams(window.location.search).get('apiKey') || '';

const calculateLaundryLoads = (itemCounts: ItemCounts): number => {
  const loadsPerItem = {
    Shirt: 3.5,
    Sock: 1,
    Underwear: 2.5,
    Shorts: 3.5,
  };

  const totalUnits = Object.entries(itemCounts).reduce((acc, [item, count]) => {
    return acc + Math.ceil(count / (loadsPerItem as any)[item]);
  }, 0);

  return Math.ceil(totalUnits / 30);
};

function App() {
  const [itemCounts, setItemCounts] = useState<ItemCounts>({Shirt: 0, Sock: 0, Underwear: 0, Shorts: 0});
  const [files, setFiles] = useState<FileList | []>([]);
  const [numOfLaundryLoads, setNumOfLaundryLoads] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const apiKey = useApiKey();

  const handleFileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!files) return;
    if(!apiKey) return;

    setIsLoading(true);

    const newCounts = await inferFromImageFiles(apiKey, Array.from(files));
    setItemCounts(newCounts);

    setIsLoading(false);
  }

  useEffect(() => {
    setNumOfLaundryLoads(calculateLaundryLoads(itemCounts));
  }, [itemCounts]);
  
  return (
    <div className="App">
      <h1 className="header">Laundry Estimator</h1>
      {!apiKey ? <div><h1>Missing API KEY</h1> Please add the apiKey query param to the url </div>: ''}
      <h2 className="header">Upload your photos to see how many loads of laundry you have to do.</h2>
      <p>
        This is based on an <i>estimatation</i> of the average washing machine. I used this post as a reference: 
         <a href="https://tide.com/en-us/how-to-wash-clothes/washing-machine-101/how-to-use-a-washing-machine/load-size-by-drum-size">Tide: How to use a washing machine</a>
      </p>
      <p>
        I'm going to assume you are doing a regular load of laundry, which could consist of:
      </p>
        <ul className="laundry-list">
          <li>10-12 shirts</li>
          <li>20-30 pairs of socks</li>
          <li>10-12 pairs of underwear</li>
          <li>7-8 pairs of shorts</li>
        </ul>
      <p>
        To make it simple, I'm going to declare 1 pair of socks = 1 unit of laundry. The table below shows the number of units of laundry each item is worth. Each load of laundry is 30 units.
      </p>
      <table className='units-table'>
        <thead>
          <tr>
            <th>Item</th>
            <th>Units</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Shirt</td>
            <td>3.5</td>
          </tr>
          <tr>
            <td>Sock</td>
            <td>1</td>
          </tr>
          <tr>
            <td>Underwear</td>
            <td>2.5</td>
          </tr>
          <tr>
            <td>Shorts</td>
            <td>3.5</td>
          </tr>
        </tbody>
      </table>
      <div className="upload">
        <form onSubmit={handleFileSubmit}>
          <input type="file" id="file" name="file" multiple onChange={(e: any)=>setFiles(e.target.files)} disabled={isLoading && !apiKey}/>
          <button type="submit" className={((files.length > 0) && (!isLoading) && (apiKey)) ? 'button' : 'button-disabled'} disabled={!files.length || isLoading}>Detect Laundry</button>
        </form>
      <div className="results-table-container">
    {
      isLoading && <h1>Detecting Laundry...</h1>
    }
        <div>
        </div>
        <table className='results-table'>
          <thead>
            <tr>
              <th>Shirts</th>
              <th>Socks</th>
              <th>Underwear</th>
              <th>Shorts</th>
              <th>Total loads of laundry</th>
            </tr>
          </thead>
          <tbody>
          <tr>
            <td>{itemCounts.Shirt}</td>
            <td>{itemCounts.Sock}</td>
            <td>{itemCounts.Shirt}</td>
            <td>{itemCounts.Shorts}</td>
            <td>{numOfLaundryLoads}</td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
    </div>
  );
}

export default App;
