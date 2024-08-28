const express = require('express');
const bodyParser = require('body-parser');
const { sequelize, Materiel, Commande } = require('./models');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/materiel', async (req, res) => {
  try {
    const materiels = await Materiel.findAll();
    res.render('materiel', { materiels });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des matériels' });
  }
});

app.get('/materiel/nouveau', (req, res) => {
  res.render('nouveauMateriel');
});

app.post('/materiel', async (req, res) => {
  const { nom, quantite, prix } = req.body;
  try {
    const materiel = await Materiel.create({ nom, quantite, prix });
    res.redirect('/materiel');
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du matériel' });
  }
});

app.get('/materiel/:id/modifier', async (req, res) => {
  const { id } = req.params;
  try {
    const materiel = await Materiel.findByPk(id);
    if (materiel) {
      res.render('modifierMateriel', { materiel });
    } else {
      res.status(404).json({ error: 'Matériel non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du matériel' });
  }
});

app.post('/materiel/:id', async (req, res) => {
  const { id } = req.params;
  const { nom, quantite, prix } = req.body;
  try {
    const materiel = await Materiel.findByPk(id);
    if (materiel) {
      await materiel.update({ nom, quantite, prix });
      res.redirect('/materiel');
    } else {
      res.status(404).json({ error: 'Matériel non trouvé' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la mise à jour du matériel' });
  }
});

app.post('/commande', async (req, res) => {
  const { nomClient, materiels } = req.body;

  console.log('nomClient:', nomClient);
  console.log('materiels:', materiels);

  if (!nomClient || !Array.isArray(materiels) || materiels.length === 0) {
    return res.status(400).json({ error: 'Données invalides pour la commande' });
  }

  try {
    const commande = await Commande.create({ nomClient });
    let prixTotal = 0;

    for (let i = 0; i < materiels.length; i++) {
      const { id, quantite } = materiels[i];

      // Vérifier que id et quantite sont définis et valides
      if (!id || !quantite || isNaN(quantite) || parseInt(quantite, 10) <= 0) {
        console.log(`Matériel ignoré: ${JSON.stringify(materiels[i])}`);
        continue; // Passer les entrées invalides
      }

      const materiel = await Materiel.findByPk(id);
      const quantiteLouer = parseInt(quantite, 10);

      if (materiel && materiel.quantite >= quantiteLouer) {
        const prixMateriel = quantiteLouer * materiel.prix;
        prixTotal += prixMateriel;

        // Mise à jour de la quantité disponible du matériel
        await materiel.update({ quantite: materiel.quantite - quantiteLouer });

        // Ajout du matériel à la commande avec la quantité et le prix
        await commande.addMateriel(materiel, {
          through: { quantite: quantiteLouer, prix: prixMateriel },
        });
      } else {
        return res.status(400).json({ error: `Quantité insuffisante pour le matériel ${materiel ? materiel.nom : 'inconnu'}` });
      }
    }

    await commande.update({ prixTotal });
    res.redirect('/commandes');
  } catch (error) {
    console.error('Erreur lors de la création de la commande:', error);
    res.status(500).json({ error: 'Erreur lors de la création de la commande' });
  }
});

app.post('/commande/:id/rendre', async (req, res) => {
  const { id } = req.params;
  try {
    const commande = await Commande.findByPk(id, { include: 'materiels' });

    if (commande) {
      for (const materiel of commande.materiels) {
        const commandeMateriel = materiel.CommandeMateriel;
        await materiel.update({
          quantite: materiel.quantite + commandeMateriel.quantite,
        });
      }

      await commande.destroy();
      res.redirect('/commandes');
    } else {
      res.status(404).json({ error: 'Commande non trouvée' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du rendu de la commande' });
  }
});

app.get('/commandes', async (req, res) => {
  try {
    const commandes = await Commande.findAll({ include: 'materiels' });
    res.render('commandes', { commandes });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des commandes' });
  }
});

app.get('/commande/nouveau', async (req, res) => {
  try {
    const materiels = await Materiel.findAll();
    res.render('nouvelleCommande', { materiels });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des matériels' });
  }
});

sequelize.sync().then(() => {
  app.listen(3000, () => {
    console.log('Serveur démarré sur http://localhost:3000');
  });
});