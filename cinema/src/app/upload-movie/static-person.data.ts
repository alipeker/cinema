import { MoviePerson, Profession, Gender } from './../store/movie/movie.model';

export const moviePersons = [
    {
        'id': null,
        'name' : 'John',
        'surname' : 'Washinton',
        'characterName' : 'Tenet',
        'age' : 28,
        'gender' : Gender.Man,
        'professions' : [
            Profession.Cast, Profession.Writer
        ],
        'photos' : [
            'https://m.media-amazon.com/images/M/MV5BOTY4NDcyNDM5OF5BMl5BanBnXkFtZTgwMjk4Mzk0NTM@._V1_UY317_CR5,0,214,317_AL_.jpg'
        ],
        'profession' : Profession.Cast
    } as MoviePerson
]
