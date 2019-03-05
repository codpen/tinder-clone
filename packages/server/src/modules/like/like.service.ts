import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'

import { Like } from './like.entity'
import { LikeDto } from './dto/like.dto'
import { MatchService } from '../match/match.service'
import { PubSub } from 'graphql-subscriptions'

@Injectable()
export class LikeService {
    constructor(
        @InjectRepository(Like)
        private readonly likeRepository: Repository<Like>,
        private readonly matchService: MatchService
    ) {}

    getById(id: number) {
        return this.likeRepository.findOne(id)
    }

    getByUserIdAndCount(userId: number) {
        return this.likeRepository
            .createQueryBuilder('like')
            .where('like.toUserId = :userId', { userId })
            .andWhere(`like.date > (now() - interval '1 day')`)
            .getCount()
    }

    async like(like: LikeDto, pubsub: PubSub) {
        const { userId, toUserId } = like

        const isMatch = await this.likeRepository.findOne({
            where: { userId: toUserId, toUserId: userId }
        })

        if (isMatch) {
            this.matchService.createMatch(userId, toUserId)

            this.likeRepository.remove(isMatch)

            return 'match'
        }

        const newLike = this.likeRepository.create({
            ...like,
            date: new Date()
        })
        await this.likeRepository.save(newLike)

        pubsub.publish('newLike', newLike)
    }
}
