export interface CorpsClient {
  nom: string;
  email: string;
}

export interface CorpsProduit {
  nom: string;
  prix: number;
  stock: number;
  categorie: string;
}

export interface CorpsCommande {
  idClient: number;
  produits: { idProduit: number; quantite: number }[];
  statut: "en cours" | "livrée";
}
