module.exports = (sequelize, DataTypes) => {
    const Commande = sequelize.define('Commande', {
        nomClient: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        prixTotal: {
            type: DataTypes.FLOAT,
            defaultValue: 0.0,
        },
    }, {
        timestamps: true,
    });

    Commande.associate = function (models) {
        Commande.belongsToMany(models.Materiel, { through: 'CommandeMateriel', as: 'materiels', foreignKey: 'commandeId' });
    };

    return Commande;
};
