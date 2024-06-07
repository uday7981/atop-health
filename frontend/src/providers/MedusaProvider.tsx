import { Decryption, Listing, Sale } from '@/types/medusa';
import { Medusa, PublicKey, SecretKey } from '@medusa-network/medusa-sdk';
import { createContext, PropsWithChildren, useMemo, useState } from 'react';

interface IMedusaState {
  medusa: Medusa<SecretKey, PublicKey<SecretKey>> | null;
  listings: Listing[];
  sales: Sale[];
  decryptions: Decryption[];

  updateMedusa: (
    medusa: Medusa<SecretKey, PublicKey<SecretKey>> | null
  ) => void;
  updateListings: (listings: Listing[]) => void;
  updateSales: (sales: Sale[]) => void;
  updateDecryptions: (decryptions: Decryption[]) => void;

  addListing: (listing: Listing) => void;
  addSale: (sale: Sale) => void;
  addDecryption: (decryption: Decryption) => void;
}

export const MedusaContext = createContext<IMedusaState>({
  medusa: null,
  listings: [],
  sales: [],
  decryptions: [],

  updateMedusa: (medusa: Medusa<SecretKey, PublicKey<SecretKey>> | null) => {},
  updateListings: (listings: Listing[]) => {},
  updateSales: (sales: []) => {},
  updateDecryptions: (decryptions: []) => {},

  addListing: (listing: Listing) => {},

  addSale: (sale: Sale) => {},

  addDecryption: (decryption: Decryption) => {},
});

const MedusaProvider = ({ children }: PropsWithChildren<{}>) => {
  const [medusa, setMedusa] = useState<Medusa<
    SecretKey,
    PublicKey<SecretKey>
  > | null>();
  const [listings, setlistings] = useState<Listing[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [decryptions, setDecryptions] = useState<Decryption[]>([]);

  const value = useMemo<IMedusaState>(
    () => ({
      medusa,
      listings,
      sales,
      decryptions,
      updateMedusa(medusa) {
        setMedusa(medusa);
      },
      updateListings(listings) {
        setlistings(listings);
      },
      updateDecryptions(decryptions) {
        setDecryptions(decryptions);
      },
      updateSales(sales) {
        setSales(sales);
      },
      addListing(listing) {
        if (!listings.find((l) => l.cipherId === listing.cipherId)) {
          setlistings([listing, ...listings]);
          return;
        }

        setlistings(listings);
      },
      addDecryption(decryption) {
        if (!decryptions.find((d) => d.requestId === decryption.requestId)) {
          setDecryptions([decryption, ...decryptions]);
          return;
        }
        setDecryptions(decryptions);
      },
      addSale(sale) {
        if (!sales.find((s) => s.requestId === sale.requestId)) {
          setSales([sale, ...sales]);
          return;
        }
        setSales(sales);
      },
    }),
    [medusa, listings, decryptions, sales]
  );

  return (
    <MedusaContext.Provider value={value}>{children}</MedusaContext.Provider>
  );
};

export default MedusaProvider;
