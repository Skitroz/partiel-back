module.exports = (sequelize, DataTypes) => {
    const Materiel = sequelize.define('Materiel', {
        nom: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        quantite: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        prix: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    }, {
        timestamps: true,
    });

    Materiel.associate = function (models) {
        Materiel.belongsToMany(models.Commande, { through: 'CommandeMateriel', as: 'commandes', foreignKey: 'materielId' });
    };

    return Materiel;
};
